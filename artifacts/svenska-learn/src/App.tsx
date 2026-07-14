import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
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
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminBackupPage from '@/pages/admin/AdminBackupPage';
import AdminLanguagesPage from '@/pages/admin/AdminLanguagesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import BottomNav from '@/components/BottomNav';
import AppSidebar from '@/components/AppSidebar';
import VoiceTranslator from '@/components/VoiceTranslator';
import { AudioSettingsProvider } from '@/lib/audioSettings';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/lessons" component={AdminLessonsPage} />
      <Route path="/admin/words" component={AdminWordsPage} />
      <Route path="/admin/conversations" component={AdminConversationsPage} />
      <Route path="/admin/exams" component={AdminExamsPage} />
      <Route path="/admin/ai" component={AdminAIPage} />
      <Route path="/admin/reports" component={AdminReportsPage} />
      <Route path="/admin/backup" component={AdminBackupPage} />
      <Route path="/admin/languages" component={AdminLanguagesPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/stats" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioSettingsProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="pb-[64px]">
              <Router />
            </div>
            <AppSidebar />
            <VoiceTranslator />
            <BottomNav />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AudioSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;