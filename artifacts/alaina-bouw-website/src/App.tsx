import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Layout } from '@/components/layout/Layout';
import { ContactPage, QuotePage } from '@/pages/Contact';
import Home from '@/pages/Home';
import { AboutPage, AreaPage, ProcessPage } from '@/pages/Info';
import { CookiesPage, PrivacyPage, TermsPage } from '@/pages/Legal';
import NotFound from '@/pages/NotFound';
import ProjectsPage from '@/pages/Projects';
import { ServiceDetailPage, ServicesPage } from '@/pages/Services';

const queryClient = new QueryClient();

function Routes() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/diensten" component={ServicesPage} />
          <Route path="/diensten/:slug">{(params) => <ServiceDetailPage key={params.slug} slug={params.slug} />}</Route>
          <Route path="/projecten" component={ProjectsPage} />
          <Route path="/werkwijze" component={ProcessPage} />
          <Route path="/over-ons" component={AboutPage} />
          <Route path="/werkgebied" component={AreaPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/offerte-aanvragen" component={QuotePage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/cookies" component={CookiesPage} />
          <Route path="/algemene-voorwaarden" component={TermsPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes />
      </WouterRouter>
    </QueryClientProvider>
  );
}
