<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

const BUSINESS_EMAIL = 'info@alainabouw.nl';
const MAX_REQUESTS = 5;
const RATE_WINDOW_SECONDS = 600;
const MAX_JSON_BYTES = 16384;
const MAX_UPLOAD_BYTES = 24 * 1024 * 1024;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 20 * 1024 * 1024;
const MAX_FILES = 5;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function field(array $data, string $key, int $maxLength, bool $required = false): ?string
{
    $value = $data[$key] ?? null;
    if (!is_string($value)) {
        return $required ? null : '';
    }

    $value = trim($value);
    if (mb_strlen($value, 'UTF-8') > $maxLength || ($required && $value === '')) {
        return null;
    }

    return $value;
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function referenceCode(): string
{
    return 'AB-' . strtoupper(bin2hex(random_bytes(4)));
}

function allowRequest(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $originHost = parse_url($origin, PHP_URL_HOST);
        $requestHost = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
        if (!is_string($originHost) || strtolower($originHost) !== $requestHost) {
            return false;
        }
    }

    $ipKey = hash('sha256', __DIR__ . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $path = sys_get_temp_dir() . '/alaina-bouw-lead-rate.json';
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return false;
    }
    chmod($path, 0600);

    $now = time();
    $raw = stream_get_contents($handle);
    $rateWindows = is_string($raw) ? json_decode($raw, true) : [];
    if (!is_array($rateWindows)) {
        $rateWindows = [];
    }
    foreach ($rateWindows as $key => $timestamps) {
        $recent = array_values(array_filter(
            is_array($timestamps) ? $timestamps : [],
            static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $now - RATE_WINDOW_SECONDS,
        ));
        if ($recent === []) {
            unset($rateWindows[$key]);
        } else {
            $rateWindows[$key] = $recent;
        }
    }
    $timestamps = $rateWindows[$ipKey] ?? [];
    if (count($timestamps) >= MAX_REQUESTS) {
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($rateWindows));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        return false;
    }

    $timestamps[] = $now;
    $rateWindows[$ipKey] = $timestamps;
    $encoded = json_encode($rateWindows);
    rewind($handle);
    $writeSucceeded = ftruncate($handle, 0)
        && is_string($encoded)
        && fwrite($handle, $encoded) === strlen($encoded)
        && fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $writeSucceeded;
}

function timelineLabel(string $value): string
{
    return [
        'asap' => 'Zo snel mogelijk',
        'within_month' => 'Binnen een maand',
        'one_to_three_months' => '1 – 3 maanden',
        'three_to_six_months' => '3 – 6 maanden',
        'exploring' => 'Ik oriënteer me nog',
    ][$value];
}

function budgetLabel(string $value): string
{
    return [
        'under_2500' => 'Tot € 2.500',
        '2500_5000' => '€ 2.500 – 5.000',
        '5000_10000' => '€ 5.000 – 10.000',
        '10000_25000' => '€ 10.000 – 25.000',
        'over_25000' => 'Meer dan € 25.000',
        'undecided' => 'Weet ik nog niet',
    ][$value];
}

function detailRow(string $label, string $value): string
{
    return '<tr><td style="padding:9px 0;border-bottom:1px solid #eee9e3;color:#6b645e;vertical-align:top">'
        . escapeHtml($label) . '</td><td style="padding:9px 0;border-bottom:1px solid #eee9e3;color:#1b1817;vertical-align:top;white-space:pre-wrap">'
        . escapeHtml($value) . '</td></tr>';
}

function emailLayout(string $content): string
{
    return '<!doctype html><html lang="nl"><body style="margin:0;background:#f7f5f2;padding:32px 16px;font-family:Arial,sans-serif;color:#1b1817">'
        . '<table role="presentation" style="width:100%;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e3ddd5;border-radius:16px;border-spacing:0;overflow:hidden">'
        . '<tr><td style="padding:28px 32px;border-bottom:1px solid #e3ddd5">'
        . '<table role="presentation" style="border-spacing:0"><tr>'
        . '<td style="padding:0 14px 0 0;vertical-align:middle"><img src="cid:alaina-bouw-logo" width="60" height="50" alt="Alaina Bouw beeldmerk" style="display:block;width:60px;height:50px"></td>'
        . '<td style="vertical-align:middle"><p style="margin:0;color:#a90f14;font-size:18px;font-weight:bold;letter-spacing:2px">ALAINA BOUW</p>'
        . '<p style="margin:4px 0 0;color:#6b645e;font-size:11px;font-weight:bold;letter-spacing:3px">KLUSBEDRIJF</p></td>'
        . '</tr></table>'
        . '</td></tr><tr><td style="padding:28px 32px 32px">' . $content . '</td></tr>'
        . '<tr><td style="padding:18px 32px;border-top:1px solid #e3ddd5;color:#6b645e;font-size:12px">'
        . 'Alaina Bouw Klusbedrijf · <a href="mailto:' . BUSINESS_EMAIL . '" style="color:#a90f14">' . BUSINESS_EMAIL . '</a>'
        . '</td></tr></table></body></html>';
}

/**
 * @param list<array{path: string, name: string}> $attachments
 */
function sendEmail(array $config, string $recipient, string $subject, string $text, string $html, ?string $replyTo = null, array $attachments = []): void
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = (int) $config['smtp_port'];
    $mail->Timeout = 20;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom(BUSINESS_EMAIL, 'Alaina Bouw Klusbedrijf');
    $mail->addAddress($recipient);
    if ($replyTo !== null) {
        $mail->addReplyTo($replyTo);
    }
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $html;
    $mail->AltBody = $text;
    $mail->addEmbeddedImage(dirname(__DIR__) . '/logo-mark.png', 'alaina-bouw-logo', 'logo-mark.png', PHPMailer::ENCODING_BASE64, 'image/png');
    foreach ($attachments as $file) {
        $mail->addAttachment($file['path'], $file['name']);
    }
    $mail->send();
}

function isMultipartRequest(): bool
{
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    return stripos($type, 'multipart/form-data') === 0;
}

function requestByteLimit(): int
{
    return isMultipartRequest() ? MAX_UPLOAD_BYTES : MAX_JSON_BYTES;
}

/**
 * @return list<array{path: string, name: string}>
 */
function collectAttachments(): array
{
    if (!isset($_FILES['files'])) {
        return [];
    }

    $batch = $_FILES['files'];
    $entries = [];
    if (is_array($batch['name'] ?? null)) {
        foreach ($batch['name'] as $index => $name) {
            $entries[] = [
                'name' => is_string($name) ? $name : '',
                'tmp_name' => is_string($batch['tmp_name'][$index] ?? null) ? $batch['tmp_name'][$index] : '',
                'error' => is_int($batch['error'][$index] ?? null) ? $batch['error'][$index] : UPLOAD_ERR_NO_FILE,
                'size' => is_int($batch['size'][$index] ?? null) ? $batch['size'][$index] : 0,
            ];
        }
    } else {
        $entries[] = [
            'name' => is_string($batch['name'] ?? null) ? $batch['name'] : '',
            'tmp_name' => is_string($batch['tmp_name'] ?? null) ? $batch['tmp_name'] : '',
            'error' => is_int($batch['error'] ?? null) ? $batch['error'] : UPLOAD_ERR_NO_FILE,
            'size' => is_int($batch['size'] ?? null) ? $batch['size'] : 0,
        ];
    }

    $entries = array_values(array_filter(
        $entries,
        static fn (array $file): bool => $file['error'] !== UPLOAD_ERR_NO_FILE,
    ));
    if (count($entries) > MAX_FILES) {
        respond(400, ['error' => 'U kunt maximaal 5 bestanden meesturen.']);
    }

    $allowedExtensions = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/webp' => ['webp'],
        'image/gif' => ['gif'],
        'image/heic' => ['heic', 'heif'],
        'image/heif' => ['heic', 'heif'],
        'image/heic-sequence' => ['heic'],
        'image/heif-sequence' => ['heif'],
        'application/pdf' => ['pdf'],
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $total = 0;
    $usedNames = [];
    $attachments = [];

    foreach ($entries as $file) {
        if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE || $file['size'] > MAX_FILE_BYTES) {
            respond(413, ['error' => 'Een bestand is te groot. Maximaal 8 MB per bestand.']);
        }
        if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
            respond(400, ['error' => 'Een bestand kon niet worden gelezen. Probeer het opnieuw.']);
        }

        $total += $file['size'];
        if ($total > MAX_TOTAL_FILE_BYTES) {
            respond(413, ['error' => 'De bestanden zijn samen te groot. Maximaal 20 MB in totaal.']);
        }

        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $detected = $finfo->file($file['tmp_name']);
        $heicFallback = $detected === 'application/octet-stream' && in_array($extension, ['heic', 'heif'], true);
        if (
            !is_string($detected) ||
            (!isset($allowedExtensions[$detected]) && !$heicFallback) ||
            ($heicFallback === false && !in_array($extension, $allowedExtensions[$detected], true)) ||
            !in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'pdf'], true)
        ) {
            respond(400, ['error' => 'Gebruik een foto (JPG, PNG, WEBP, HEIC) of een PDF.']);
        }

        $base = pathinfo($file['name'], PATHINFO_FILENAME);
        $base = preg_replace('/[^\p{L}\p{N}._ -]+/u', '', $base) ?? '';
        $base = trim((string) $base, ". \t\n\r\0\x0B");
        if ($base === '') {
            $base = 'bestand';
        }
        $base = mb_substr($base, 0, 60, 'UTF-8');
        $safeName = $base . '.' . $extension;
        if (isset($usedNames[$safeName])) {
            $usedNames[$safeName]++;
            $safeName = $base . '-' . $usedNames[$safeName] . '.' . $extension;
        } else {
            $usedNames[$safeName] = 1;
        }

        $attachments[] = ['path' => $file['tmp_name'], 'name' => $safeName];
    }

    return $attachments;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Deze aanvraagmethode wordt niet ondersteund.']);
}

if (ctype_digit($_SERVER['CONTENT_LENGTH'] ?? '') && (int) $_SERVER['CONTENT_LENGTH'] > requestByteLimit()) {
    respond(413, ['error' => 'De aanvraag is te groot. Maximaal 8 MB per bestand en 20 MB in totaal.']);
}

if (!allowRequest()) {
    respond(429, ['error' => 'Er zijn te veel aanvragen verstuurd. Probeer het later opnieuw.']);
}

try {
    if (isMultipartRequest()) {
        if ($_POST === [] && $_FILES === [] && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
            respond(413, ['error' => 'De bestanden zijn te groot. Maximaal 8 MB per bestand en 20 MB in totaal.']);
        }
        $payload = $_POST['payload'] ?? '';
        $data = json_decode(is_string($payload) ? $payload : '', true, 512, JSON_THROW_ON_ERROR);
    } else {
        $rawBody = file_get_contents('php://input', false, null, 0, MAX_JSON_BYTES + 1);
        if (is_string($rawBody) && strlen($rawBody) > MAX_JSON_BYTES) {
            respond(413, ['error' => 'De aanvraag is te groot.']);
        }
        $data = json_decode(is_string($rawBody) ? $rawBody : '', true, 512, JSON_THROW_ON_ERROR);
    }
} catch (JsonException) {
    respond(400, ['error' => 'De aanvraag kon niet worden gelezen. Controleer de ingevulde gegevens.']);
}

if (!is_array($data)) {
    respond(400, ['error' => 'Controleer de ingevulde gegevens en probeer het opnieuw.']);
}

if (is_string($data['website'] ?? null) && trim($data['website']) !== '') {
    respond(201, ['reference' => referenceCode()]);
}

$service = field($data, 'service', 80, true);
$description = field($data, 'description', 4000, true);
$timeline = field($data, 'timeline', 40, true);
$city = field($data, 'city', 100, true);
$postalCode = field($data, 'postalCode', 10);
$budget = field($data, 'budget', 40);
$name = field($data, 'name', 120, true);
$phone = field($data, 'phone', 40, true);
$email = field($data, 'email', 254, true);
$contactPreference = field($data, 'contactPreference', 20, true);
$timelineOptions = ['asap', 'within_month', 'one_to_three_months', 'three_to_six_months', 'exploring'];
$budgetOptions = ['', 'under_2500', '2500_5000', '5000_10000', '10000_25000', 'over_25000', 'undecided'];

if (
    $service === null || !preg_match('/^[a-z0-9-]{1,80}$/', $service) ||
    $description === null || mb_strlen($description, 'UTF-8') < 10 ||
    $timeline === null || !in_array($timeline, $timelineOptions, true) ||
    $city === null || mb_strlen($city, 'UTF-8') < 2 ||
    $postalCode === null || ($postalCode !== '' && !preg_match('/^\d{4}\s?[a-z]{2}$/i', $postalCode)) ||
    $budget === null || !in_array($budget, $budgetOptions, true) ||
    $name === null || mb_strlen($name, 'UTF-8') < 2 ||
    $phone === null || !preg_match('/^[+\d][\d\s\-().]{5,}$/', $phone) ||
    $email === null || filter_var($email, FILTER_VALIDATE_EMAIL) === false ||
    $contactPreference === null || !in_array($contactPreference, ['email', 'phone', 'whatsapp'], true) ||
    ($data['privacyConsent'] ?? null) !== true
) {
    respond(400, ['error' => 'Controleer de ingevulde gegevens en probeer het opnieuw.']);
}

$attachments = isMultipartRequest() ? collectAttachments() : [];
$attachmentNames = array_map(static fn (array $file): string => $file['name'], $attachments);
$attachmentText = $attachmentNames === [] ? '' : 'Bijlagen: ' . implode(', ', $attachmentNames);

$postalCode = strtoupper($postalCode);
$reference = referenceCode();
$firstName = explode(' ', $name)[0];
$serviceLabel = str_replace('-', ' ', $service);
$timelineText = timelineLabel($timeline);
$budgetText = $budget !== '' ? budgetLabel($budget) : '';
$rows = detailRow('Soort werk', $serviceLabel)
    . detailRow('Omschrijving', $description)
    . detailRow('Gewenste planning', $timelineText)
    . detailRow('Plaats', $city)
    . ($postalCode !== '' ? detailRow('Postcode', $postalCode) : '')
    . ($budgetText !== '' ? detailRow('Budgetindicatie', $budgetText) : '');
$configPath = __DIR__ . '/config.local.php';

if (!is_file($configPath)) {
    error_log('Alaina Bouw form email configuration is missing.');
    respond(503, ['error' => 'Het formulier is tijdelijk niet beschikbaar. Neem contact met ons op via WhatsApp.']);
}

$config = require $configPath;
if (
    !is_array($config) ||
    !is_string($config['smtp_host'] ?? null) || $config['smtp_host'] === '' ||
    !is_int($config['smtp_port'] ?? null) || $config['smtp_port'] < 1 || $config['smtp_port'] > 65535 ||
    !is_string($config['smtp_username'] ?? null) || $config['smtp_username'] === '' ||
    !is_string($config['smtp_password'] ?? null) || $config['smtp_password'] === '' ||
    !is_file(dirname(__DIR__) . '/logo-mark.png')
) {
    error_log('Alaina Bouw form email configuration or logo is invalid.');
    respond(503, ['error' => 'Het formulier is tijdelijk niet beschikbaar. Neem contact met ons op via WhatsApp.']);
}

$adminText = "Nieuwe offerteaanvraag {$reference}\nNaam: {$name}\nE-mail: {$email}\nTelefoon: {$phone}\nSoort werk: {$serviceLabel}\nOmschrijving: {$description}\nPlanning: {$timelineText}\nPlaats: {$city}\n"
    . ($postalCode !== '' ? "Postcode: {$postalCode}\n" : '')
    . ($budgetText !== '' ? "Budgetindicatie: {$budgetText}\n" : '')
    . "Contactvoorkeur: {$contactPreference}\n"
    . ($attachmentText !== '' ? $attachmentText . "\n" : '')
    . "Referentie: {$reference}";
$adminHtml = emailLayout(
    '<h1 style="margin:0 0 8px;font-size:24px">Nieuwe offerteaanvraag</h1>'
    . '<p style="margin:0 0 20px;color:#6b645e">Referentie: <strong>' . escapeHtml($reference) . '</strong></p>'
    . '<table role="presentation" style="width:100%;border-spacing:0;font-size:14px">'
    . detailRow('Naam', $name) . detailRow('E-mail', $email) . detailRow('Telefoon', $phone) . $rows
    . detailRow('Contactvoorkeur', $contactPreference)
    . ($attachmentText !== '' ? detailRow('Bijlagen', implode(', ', $attachmentNames)) : '')
    . '</table>',
);
$customerText = "Beste {$firstName},\n\nBedankt voor uw aanvraag. We hebben uw bericht goed ontvangen en nemen contact met u op.\n\nSoort werk: {$serviceLabel}\nOmschrijving: {$description}\nPlanning: {$timelineText}\nPlaats: {$city}\n"
    . ($postalCode !== '' ? "Postcode: {$postalCode}\n" : '')
    . ($budgetText !== '' ? "Budgetindicatie: {$budgetText}\n" : '')
    . ($attachmentNames !== [] ? 'Meegestuurde bestanden: ' . count($attachmentNames) . "\n" : '')
    . "\nUw referentie: {$reference}\n\nMet vriendelijke groet,\nAlaina Bouw Klusbedrijf";
$customerHtml = emailLayout(
    '<h1 style="margin:0 0 12px;font-size:24px">Bedankt voor uw aanvraag, ' . escapeHtml($firstName) . '</h1>'
    . '<p style="margin:0 0 20px;line-height:1.65;color:#4b4541">We hebben uw bericht goed ontvangen en nemen contact met u op.</p>'
    . '<p style="margin:0 0 16px;padding:14px 16px;border-radius:10px;background:#f7e7e6;color:#820b0f;font-size:14px">Uw referentie: <strong>'
    . escapeHtml($reference) . '</strong></p><h2 style="margin:24px 0 8px;font-size:17px">Uw aanvraag</h2>'
    . '<table role="presentation" style="width:100%;border-spacing:0;font-size:14px">' . $rows
    . ($attachmentNames !== [] ? detailRow('Meegestuurde bestanden', (string) count($attachmentNames)) : '')
    . '</table>'
    . '<p style="margin:24px 0 0;line-height:1.65;color:#4b4541">Met vriendelijke groet,<br><strong>Alaina Bouw Klusbedrijf</strong></p>',
);

try {
    sendEmail($config, BUSINESS_EMAIL, "Nieuwe offerteaanvraag {$reference}", $adminText, $adminHtml, $email, $attachments);
    sendEmail($config, $email, "We hebben uw aanvraag ontvangen ({$reference})", $customerText, $customerHtml, BUSINESS_EMAIL);
} catch (MailException $error) {
    error_log('Alaina Bouw SMTP delivery failed: ' . $error->getMessage());
    respond(503, ['error' => 'Uw aanvraag is niet verstuurd. Probeer het later opnieuw of neem contact op via WhatsApp.']);
}

respond(201, ['reference' => $reference]);
