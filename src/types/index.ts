// 性别类型
export type Gender = 'male' | 'female';

// 测试项目类型
export type TestItem = 
  | 'bmi' 
  | 'vitalCapacity' 
  | 'run50m' 
  | 'sittingForward' 
  | 'standingLongJump' 
  | 'pullUps' 
  | 'sitUps' 
  | 'run800m' 
  | 'run1000m';

// 学生信息
export interface Student {
  id: string;
  name: string;
  gender: Gender;
  classId: string;
}

// 班级信息
export interface Class {
  id: string;
  name: string;
}

// 测试成绩
export interface TestScores {
  bmi?: number; // BMI值
  height?: number; // 身高(cm)
  weight?: number; // 体重(kg)
  vitalCapacity?: number; // 肺活量(ml)
  run50m?: number; // 50米跑(秒)
  sittingForward?: number; // 坐位体前屈(cm)
  standingLongJump?: number; // 立定跳远(cm)
  pullUps?: number; // 引体向上(次) - 男生
  sitUps?: number; // 仰卧起坐(次) - 女生
  run800m?: number; // 800米跑(秒) - 女生
  run1000m?: number; // 1000米跑(秒) - 男生
}

// 学生完整记录
export interface StudentRecord {
  studentId: string;
  scores: TestScores;
}

// 项目分数和等级
export interface ScoreResult {
  score: number; // 原始分数(0-100)
  weightedScore: number; // 加权后分数
  level: 'excellent' | 'good' | 'pass' | 'fail'; // 等级
  bonus: number; // 加分
}

// 完整成绩结果
export interface FullScoreResult {
  bmi: ScoreResult;
  vitalCapacity: ScoreResult;
  run50m: ScoreResult;
  sittingForward: ScoreResult;
  standingLongJump: ScoreResult;
  pullUps?: ScoreResult; // 男生
  sitUps?: ScoreResult; // 女生
  run800m?: ScoreResult; // 女生
  run1000m?: ScoreResult; // 男生
  totalScore: number; // 总分(最高120)
  totalLevel: 'excellent' | 'good' | 'pass' | 'fail';
}

// 录入模式
export type EntryMode = 'byStudent' | 'byProject';

// 当前录入的项目
export interface CurrentEntryProject {
  project: TestItem;
  gender: Gender;
}
