import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userProgressRouter from "./userProgress";
import lessonsRouter from "./lessons";
import lessonDetailRouter from "./lessonDetail";
import wordsRouter from "./words";
import statsRouter from "./stats";
import challengesRouter from "./challenges";
import conversationsRouter from "./conversations";
import chatRouter from "./chat";
import dictionaryRouter from "./dictionary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(userProgressRouter);
router.use(lessonDetailRouter);
router.use(lessonsRouter);
router.use(wordsRouter);
router.use(statsRouter);
router.use(challengesRouter);
router.use(conversationsRouter);
router.use(chatRouter);
router.use(dictionaryRouter);

export default router;
