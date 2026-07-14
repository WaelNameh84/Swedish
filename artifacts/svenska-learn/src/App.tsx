import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import WelcomePage from '@/pages/WelcomePage';
import ConversationsPage from '@/pages/ConversationsPage';
import ChatPage from '@/pages/ChatPage';
import LessonsPage from '@/pages/LessonsPage';
import LessonDetailPage from '@/pages/LessonDetailPage';
import DictionaryPage from '@/pages/DictionaryPage';
import VerbsPage from '@/pages/VerbsPage';
import AiTeacherHubPage from '@/pages/AiTeacherHubPage';
import AiToolPage from '@/pages/AiToolPage';
import PronunciationPage from '@/pages/PronunciationPage';
import AudioLearningHubPage from '@/pages/AudioLearningHubPage';
import RadioPage from '@/pages/audio/RadioPage';
import SleepModePage from '@/pages/audio/SleepModePage';
import RepeatPracticePage from '@/pages/audio/RepeatPracticePage';
import AudioSpeedPage from '@/pages/audio/AudioSpeedPage';
import AutoTranslatePage from '@/pages/audio/AutoTranslatePage';
import BackgroundPlaybackPage from '@/pages/audio/BackgroundPlaybackPage';
import OfflineDownloadPage from '@/pages/audio/OfflineDownloadPage';
import PronunciationHubPage from '@/pages/PronunciationHubPage';
import RecordVoicePage from '@/pages/pronunciation/RecordVoicePage';
import ComparePronunciationPage from '@/pages/pronunciation/ComparePronunciationPage';
import AIEvaluationPage from '@/pages/pronunciation/AIEvaluationPage';
import ErrorCorrectionPage from '@/pages/pronunciation/ErrorCorrectionPage';
import ArticulationPointsPage from '@/pages/pronunciation/ArticulationPointsPage';
import PronunciationExercisesPage from '@/pages/pronunciation/PronunciationExercisesPage';
import GamesHubPage from '@/pages/GamesHubPage';
import WordOrderGame from '@/pages/games/WordOrderGame';
import MultipleChoiceGame from '@/pages/games/MultipleChoiceGame';
import FlashcardsGame from '@/pages/games/FlashcardsGame';
import MissingWordGame from '@/pages/games/MissingWordGame';
import SpeedChallengeGame from '@/pages/games/SpeedChallengeGame';
import PictureGame from '@/pages/games/PictureGame';
import ListeningGame from '@/pages/games/ListeningGame';
import ExamsHubPage from '@/pages/ExamsHubPage';
import ExamRunnerPage from '@/pages/exams/ExamRunnerPage';
import CertificatePage from '@/pages/exams/CertificatePage';
import PerformanceReportPage from '@/pages/exams/PerformanceReportPage';
import TranslatorHubPage from '@/pages/TranslatorHubPage';
import TextTranslatePage from '@/pages/translator/TextTranslatePage';
import VoiceTranslatePage from '@/pages/translator/VoiceTranslatePage';
import CameraTranslatePage from '@/pages/translator/CameraTranslatePage';
import ConversationModePage from '@/pages/translator/ConversationModePage';
import SettingsPage from '@/pages/SettingsPage';
import StatisticsPage from '@/pages/StatisticsPage';
import ProfilePage from '@/pages/ProfilePage';
import CommunityHubPage from '@/pages/CommunityHubPage';
import FriendsPage from '@/pages/community/FriendsPage';
import CompetitionsPage from '@/pages/community/CompetitionsPage';
import LeaderboardPage from '@/pages/community/LeaderboardPage';
import GroupsPage from '@/pages/community/GroupsPage';
import ChallengesPage from '@/pages/community/ChallengesPage';
import ShareAchievementsPage from '@/pages/community/ShareAchievementsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminLessonsPage from '@/pages/admin/AdminLessonsPage';
import AdminWordsPage from '@/pages/admin/AdminWordsPage';
import AdminConversationsPage from '@/pages/admin/AdminConversationsPage';
import AdminExamsPage from '@/pages/admin/AdminExamsPage';
import AdminAIPage from '@/pages/admin/AdminAIPage';
import AdminAIKeysPage from '@/pages/admin/AdminAIKeysPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminBackupPage from '@/pages/admin/AdminBackupPage';
import AdminLanguagesPage from '@/pages/admin/AdminLanguagesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AppSidebar from '@/components/AppSidebar';
import VoiceTranslator from '@/components/VoiceTranslator';
import BiometricLoginButton from '@/components/BiometricLoginButton';
import { AudioSettingsProvider } from '@/lib/audioSettings';
import { Route, Switch, Redirect, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev, auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: 'hsl(214 89% 40%)',
    colorForeground: 'hsl(220 20% 20%)',
    colorMutedForeground: 'hsl(220 15% 45%)',
    colorDanger: 'hsl(0 84% 60%)',
    colorBackground: 'hsl(0 0% 100%)',
    colorInput: 'hsl(210 20% 96%)',
    colorInputForeground: 'hsl(220 20% 20%)',
    colorNeutral: 'hsl(220 15% 90%)',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[hsl(220,20%,20%)] font-bold',
    headerSubtitle: 'text-[hsl(220,15%,45%)]',
    socialButtonsBlockButtonText: 'text-[hsl(220,20%,20%)] font-semibold',
    formFieldLabel: 'text-[hsl(220,20%,20%)] font-semibold',
    footerActionLink: 'text-[hsl(214,89%,40%)] font-bold',
    footerActionText: 'text-[hsl(220,15%,45%)]',
    dividerText: 'text-[hsl(220,15%,45%)]',
    identityPreviewEditButton: 'text-[hsl(214,89%,40%)]',
    formFieldSuccessText: 'text-emerald-600',
    alertText: 'text-[hsl(0,84%,45%)]',
    logoBox: 'flex justify-center py-2',
    logoImage: 'h-12 w-12 rounded-2xl',
    socialButtonsBlockButton: 'border border-[hsl(220,15%,90%)] hover:bg-[hsl(210,20%,96%)]',
    formButtonPrimary: 'bg-[hsl(214,89%,40%)] hover:bg-[hsl(214,89%,34%)] text-white font-bold',
    formFieldInput: 'border border-[hsl(220,15%,90%)] focus:border-[hsl(214,89%,40%)]',
    footerAction: 'text-center',
    dividerLine: 'bg-[hsl(220,15%,90%)]',
    alert: 'bg-red-50 border border-red-200',
    otpCodeFieldInput: 'border border-[hsl(220,15%,90%)]',
    formFieldRow: '',
    main: '',
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-10" dir="rtl">
      <BiometricLoginButton />
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10" dir="rtl">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function HomeGate() {
  return (
    <>
      <Show when="signed-in">
        <Home />
      </Show>
      <Show when="signed-out">
        <WelcomePage />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

// Every learning feature is private per account. Signed-out visitors who
// land on any of these paths (e.g. a bookmarked link) are sent to "/",
// which is the public welcome/sign-in entry point.
function ProtectedApp() {
  return (
    <>
      <Show when="signed-in">
        <Switch>
          <Route path="/lessons" component={LessonsPage} />
          <Route path="/lessons/:id" component={LessonDetailPage} />
          <Route path="/dictionary" component={DictionaryPage} />
          <Route path="/verbs" component={VerbsPage} />
          <Route path="/conversations" component={ConversationsPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/ai-teacher" component={AiTeacherHubPage} />
          <Route path="/ai-teacher/pronunciation" component={PronunciationPage} />
          <Route path="/ai-teacher/:tool" component={AiToolPage} />
          <Route path="/audio-learning" component={AudioLearningHubPage} />
          <Route path="/audio-learning/radio" component={RadioPage} />
          <Route path="/audio-learning/sleep" component={SleepModePage} />
          <Route path="/audio-learning/repeat" component={RepeatPracticePage} />
          <Route path="/audio-learning/speed" component={AudioSpeedPage} />
          <Route path="/audio-learning/translate" component={AutoTranslatePage} />
          <Route path="/audio-learning/background" component={BackgroundPlaybackPage} />
          <Route path="/audio-learning/offline" component={OfflineDownloadPage} />
          <Route path="/pronunciation" component={PronunciationHubPage} />
          <Route path="/pronunciation/record" component={RecordVoicePage} />
          <Route path="/pronunciation/compare" component={ComparePronunciationPage} />
          <Route path="/pronunciation/ai-evaluation" component={AIEvaluationPage} />
          <Route path="/pronunciation/errors" component={ErrorCorrectionPage} />
          <Route path="/pronunciation/articulation" component={ArticulationPointsPage} />
          <Route path="/pronunciation/exercises" component={PronunciationExercisesPage} />
          <Route path="/games" component={GamesHubPage} />
          <Route path="/games/word-order" component={WordOrderGame} />
          <Route path="/games/multiple-choice" component={MultipleChoiceGame} />
          <Route path="/games/flashcards" component={FlashcardsGame} />
          <Route path="/games/missing-word" component={MissingWordGame} />
          <Route path="/games/speed-challenge" component={SpeedChallengeGame} />
          <Route path="/games/picture-game" component={PictureGame} />
          <Route path="/games/listening-game" component={ListeningGame} />
          <Route path="/exams" component={ExamsHubPage} />
          <Route path="/exams/run/:type" component={ExamRunnerPage} />
          <Route path="/exams/certificate" component={CertificatePage} />
          <Route path="/exams/certificate/:level" component={CertificatePage} />
          <Route path="/exams/report" component={PerformanceReportPage} />
          <Route path="/translator" component={TranslatorHubPage} />
          <Route path="/translator/text" component={TextTranslatePage} />
          <Route path="/translator/voice" component={VoiceTranslatePage} />
          <Route path="/translator/camera" component={CameraTranslatePage} />
          <Route path="/translator/conversation" component={ConversationModePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/statistics" component={StatisticsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/community" component={CommunityHubPage} />
          <Route path="/community/friends" component={FriendsPage} />
          <Route path="/community/competitions" component={CompetitionsPage} />
          <Route path="/community/leaderboard" component={LeaderboardPage} />
          <Route path="/community/groups" component={GroupsPage} />
          <Route path="/community/challenges" component={ChallengesPage} />
          <Route path="/community/share" component={ShareAchievementsPage} />
          <Route path="/stats" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomeGate} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      {/* Admin area keeps its own separate password-based auth, untouched by Clerk. */}
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/lessons" component={AdminLessonsPage} />
      <Route path="/admin/words" component={AdminWordsPage} />
      <Route path="/admin/conversations" component={AdminConversationsPage} />
      <Route path="/admin/exams" component={AdminExamsPage} />
      <Route path="/admin/ai" component={AdminAIPage} />
      <Route path="/admin/ai-keys" component={AdminAIKeysPage} />
      <Route path="/admin/reports" component={AdminReportsPage} />
      <Route path="/admin/backup" component={AdminBackupPage} />
      <Route path="/admin/languages" component={AdminLanguagesPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route component={ProtectedApp} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'مرحباً بعودتك',
            subtitle: 'سجّل الدخول لمتابعة تعلّم السويدية',
          },
        },
        signUp: {
          start: {
            title: 'إنشاء حساب جديد',
            subtitle: 'ابدأ رحلتك في تعلّم السويدية',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <AudioSettingsProvider>
          <TooltipProvider>
            <div>
              <AppRoutes />
            </div>
            <Show when="signed-in">
              <AppSidebar />
              <VoiceTranslator />
            </Show>
            <Toaster />
          </TooltipProvider>
        </AudioSettingsProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
