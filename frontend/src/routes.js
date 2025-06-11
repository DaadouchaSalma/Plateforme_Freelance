import freelancerProfile from "./pages/components/freelancer/freelancerProfile";
import DashboardAdmin from "./pages/dashboard/DashboardAdmin";

export const Routes = {

    //messagerie
    Messagerie:{path:"/messagerie/msg"},
    // pages
    Presentation: { path: "/" },
    // Login:{path :"/"},
    DashboardOverview: { path: "/dashboard/overview" },
    DashboardAdmin: { path: "/dashboard/admin" },
    Transactions: { path: "/transactions" },
    Settings: { path: "/settings" },
    Upgrade: { path: "/upgrade" },
    BootstrapTables: { path: "/tables/bootstrap-tables" },
    Billing: { path: "/examples/billing" },
    Invoice: { path: "/examples/invoice" },
    Signin: { path: "/examples/sign-in"},
    Signup: { path: "/examples/sign-up" },
    Register: { path: "/examples/register" },
    ForgotPassword: { path: "/examples/forgot-password" },
    ResetPassword: { path: "/examples/reset-password" },
    Lock: { path: "/examples/lock" },
    NotFound: { path: "/examples/404" },
    ServerError: { path: "/examples/500" },

    // docs
    DocsOverview: { path: "/documentation/overview" },
    DocsDownload: { path: "/documentation/download" },
    DocsQuickStart: { path: "/documentation/quick-start" },
    DocsLicense: { path: "/documentation/license" },
    DocsFolderStructure: { path: "/documentation/folder-structure" },
    DocsBuild: { path: "/documentation/build-tools" },
    DocsChangelog: { path: "/documentation/changelog" },

    // components
    Accordions: { path: "/components/accordions" },
    Alerts: { path: "/components/alerts" },
    Badges: { path: "/components/badges" },
    Widgets: { path: "/widgets" },
    Breadcrumbs: { path: "/components/breadcrumbs" },
    Buttons: { path: "/components/buttons" },
    Forms: { path: "/components/forms" },
    Modals: { path: "/components/modals" },
    Navs: { path: "/components/navs" },
    Navbars: { path: "/components/navbars" },
    Pagination: { path: "/components/pagination" },
    Popovers: { path: "/components/popovers" },
    Progress: { path: "/components/progress" },
    Tables: { path: "/components/tables" },
    Tabs: { path: "/components/tabs" },
    Tooltips: { path: "/components/tooltips" },
    Toasts: { path: "/components/toasts" },
    WidgetsComponent: { path: "/components/widgets" },


    //Candidature 
    AjoutCandidature: { path: "/candidature/ajout/:offreId" },
    ListCandidatureF: { path: "/candidature/listF" },
    ListCandidatureC: { path: "/candidature/listC/:offreId" },

    //Freelancer
    ListFreelancer: { path: "/freelancer/listF" },
    FreelancerProfile: { path: "/freelancerprofile/:id"},
    FreelancerUpdate: { path: "/freelancer/update" },

  
    //client
    ClientUpdateProfile: { path: "/client/update"},
    ClientById: { path: "/clientprofile/:id"},

    //offre
    OffreAjout:{path:"/offre/ajout"},
    OffreListeClient:{path:"/offre/listeClient"},
    OffreUpdate:{path:"/offre/update/:id"},
    OffreListeFreelancer:{path:"/offre/listeOffreFreelancer"},

    DashboardAdminNew:{path:"/dashboard/dashboardAdmin"}


    
};