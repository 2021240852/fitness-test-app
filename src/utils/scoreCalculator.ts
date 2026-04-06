import type { Gender, TestScores, ScoreResult, FullScoreResult } from '@/types';

// 项目权重
const WEIGHTS = {
  bmi: 0.15,
  vitalCapacity: 0.15,
  run50m: 0.20,
  sittingForward: 0.10,
  standingLongJump: 0.10,
  pullUps: 0.10, // 男生
  sitUps: 0.10, // 女生
  run800m: 0.20, // 女生
  run1000m: 0.20, // 男生
};

// 获取等级
function getLevel(score: number): 'excellent' | 'good' | 'pass' | 'fail' {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 60) return 'pass';
  return 'fail';
}

// 计算BMI
export function calculateBMI(height: number, weight: number): number {
  const heightInM = height / 100;
  return parseFloat((weight / (heightInM * heightInM)).toFixed(1));
}

// BMI评分 - 男生
function calculateBMIMale(bmi: number): ScoreResult {
  let score = 0;
  if (bmi >= 15.7 && bmi <= 22.5) {
    score = 100;
  } else if (bmi <= 15.6) {
    score = 80;
  } else if (bmi >= 22.6 && bmi <= 25.2) {
    score = 80;
  } else if (bmi >= 25.3) {
    score = 60;
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.bmi).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// BMI评分 - 女生
function calculateBMIFemale(bmi: number): ScoreResult {
  let score = 0;
  if (bmi >= 15.3 && bmi <= 22.2) {
    score = 100;
  } else if (bmi <= 15.2) {
    score = 80;
  } else if (bmi >= 22.3 && bmi <= 24.8) {
    score = 80;
  } else if (bmi >= 24.9) {
    score = 60;
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.bmi).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 肺活量评分 - 男生
function calculateVitalCapacityMale(value: number): ScoreResult {
  const scores = [
    { min: 3940, score: 100 },
    { min: 3820, score: 95 },
    { min: 3700, score: 90 },
    { min: 3450, score: 85 },
    { min: 3200, score: 80 },
    { min: 3080, score: 78 },
    { min: 2960, score: 76 },
    { min: 2840, score: 74 },
    { min: 2720, score: 72 },
    { min: 2600, score: 70 },
    { min: 2480, score: 68 },
    { min: 2360, score: 66 },
    { min: 2240, score: 64 },
    { min: 2120, score: 62 },
    { min: 2000, score: 60 },
    { min: 1890, score: 50 },
    { min: 1780, score: 40 },
    { min: 1670, score: 30 },
    { min: 1560, score: 20 },
    { min: 1450, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.vitalCapacity).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 肺活量评分 - 女生
function calculateVitalCapacityFemale(value: number): ScoreResult {
  const scores = [
    { min: 2900, score: 100 },
    { min: 2850, score: 95 },
    { min: 2800, score: 90 },
    { min: 2650, score: 85 },
    { min: 2500, score: 80 },
    { min: 2400, score: 78 },
    { min: 2300, score: 76 },
    { min: 2200, score: 74 },
    { min: 2100, score: 72 },
    { min: 2000, score: 70 },
    { min: 1900, score: 68 },
    { min: 1800, score: 66 },
    { min: 1700, score: 64 },
    { min: 1600, score: 62 },
    { min: 1500, score: 60 },
    { min: 1460, score: 50 },
    { min: 1420, score: 40 },
    { min: 1380, score: 30 },
    { min: 1340, score: 20 },
    { min: 1300, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.vitalCapacity).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 50米跑评分 - 男生 (值越小越好)
function calculateRun50mMale(value: number): ScoreResult {
  const scores = [
    { max: 7.5, score: 100 },
    { max: 7.6, score: 95 },
    { max: 7.7, score: 90 },
    { max: 7.8, score: 85 },
    { max: 7.9, score: 80 },
    { max: 8.1, score: 78 },
    { max: 8.3, score: 76 },
    { max: 8.5, score: 74 },
    { max: 8.7, score: 72 },
    { max: 8.9, score: 70 },
    { max: 9.1, score: 68 },
    { max: 9.3, score: 66 },
    { max: 9.5, score: 64 },
    { max: 9.7, score: 62 },
    { max: 9.9, score: 60 },
    { max: 10.1, score: 50 },
    { max: 10.3, score: 40 },
    { max: 10.5, score: 30 },
    { max: 10.7, score: 20 },
    { max: 10.9, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value <= item.max) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.run50m).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 50米跑评分 - 女生
function calculateRun50mFemale(value: number): ScoreResult {
  const scores = [
    { max: 8.0, score: 100 },
    { max: 8.1, score: 95 },
    { max: 8.2, score: 90 },
    { max: 8.5, score: 85 },
    { max: 8.8, score: 80 },
    { max: 9.0, score: 78 },
    { max: 9.2, score: 76 },
    { max: 9.4, score: 74 },
    { max: 9.6, score: 72 },
    { max: 9.8, score: 70 },
    { max: 10.0, score: 68 },
    { max: 10.2, score: 66 },
    { max: 10.4, score: 64 },
    { max: 10.6, score: 62 },
    { max: 10.8, score: 60 },
    { max: 11.0, score: 50 },
    { max: 11.2, score: 40 },
    { max: 11.4, score: 30 },
    { max: 11.6, score: 20 },
    { max: 11.8, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value <= item.max) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.run50m).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 坐位体前屈评分 - 男生
function calculateSittingForwardMale(value: number): ScoreResult {
  const scores = [
    { min: 19.6, score: 100 },
    { min: 17.7, score: 95 },
    { min: 15.8, score: 90 },
    { min: 13.7, score: 85 },
    { min: 11.6, score: 80 },
    { min: 10.3, score: 78 },
    { min: 9.0, score: 76 },
    { min: 7.7, score: 74 },
    { min: 6.4, score: 72 },
    { min: 5.1, score: 70 },
    { min: 3.8, score: 68 },
    { min: 2.5, score: 66 },
    { min: 1.2, score: 64 },
    { min: -0.1, score: 62 },
    { min: -1.4, score: 60 },
    { min: -2.6, score: 50 },
    { min: -3.8, score: 40 },
    { min: -5.0, score: 30 },
    { min: -6.2, score: 20 },
    { min: -7.4, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.sittingForward).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 坐位体前屈评分 - 女生
function calculateSittingForwardFemale(value: number): ScoreResult {
  const scores = [
    { min: 22.7, score: 100 },
    { min: 21.0, score: 95 },
    { min: 19.3, score: 90 },
    { min: 17.6, score: 85 },
    { min: 15.9, score: 80 },
    { min: 14.6, score: 78 },
    { min: 13.3, score: 76 },
    { min: 12.0, score: 74 },
    { min: 10.7, score: 72 },
    { min: 9.4, score: 70 },
    { min: 8.1, score: 68 },
    { min: 6.8, score: 66 },
    { min: 5.5, score: 64 },
    { min: 4.2, score: 62 },
    { min: 2.9, score: 60 },
    { min: 2.1, score: 50 },
    { min: 1.3, score: 40 },
    { min: 0.5, score: 30 },
    { min: -0.3, score: 20 },
    { min: -1.1, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.sittingForward).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 立定跳远评分 - 男生
function calculateStandingLongJumpMale(value: number): ScoreResult {
  const scores = [
    { min: 240, score: 100 },
    { min: 233, score: 95 },
    { min: 226, score: 90 },
    { min: 218, score: 85 },
    { min: 210, score: 80 },
    { min: 206, score: 78 },
    { min: 202, score: 76 },
    { min: 198, score: 74 },
    { min: 194, score: 72 },
    { min: 190, score: 70 },
    { min: 186, score: 68 },
    { min: 182, score: 66 },
    { min: 178, score: 64 },
    { min: 174, score: 62 },
    { min: 170, score: 60 },
    { min: 165, score: 50 },
    { min: 160, score: 40 },
    { min: 155, score: 30 },
    { min: 150, score: 20 },
    { min: 145, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.standingLongJump).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 立定跳远评分 - 女生
function calculateStandingLongJumpFemale(value: number): ScoreResult {
  const scores = [
    { min: 200, score: 100 },
    { min: 194, score: 95 },
    { min: 188, score: 90 },
    { min: 181, score: 85 },
    { min: 174, score: 80 },
    { min: 171, score: 78 },
    { min: 168, score: 76 },
    { min: 165, score: 74 },
    { min: 162, score: 72 },
    { min: 159, score: 70 },
    { min: 156, score: 68 },
    { min: 153, score: 66 },
    { min: 150, score: 64 },
    { min: 147, score: 62 },
    { min: 144, score: 60 },
    { min: 139, score: 50 },
    { min: 134, score: 40 },
    { min: 129, score: 30 },
    { min: 124, score: 20 },
    { min: 119, score: 10 },
  ];
  
  let score = 0;
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.standingLongJump).toFixed(2)),
    level: getLevel(score),
    bonus: 0,
  };
}

// 引体向上评分 - 男生
function calculatePullUps(value: number): ScoreResult {
  const scores = [
    { min: 14, score: 100 },
    { min: 13, score: 95 },
    { min: 12, score: 90 },
    { min: 11, score: 85 },
    { min: 10, score: 80 },
    { min: 9, score: 76 },
    { min: 8, score: 72 },
    { min: 7, score: 68 },
    { min: 6, score: 64 },
    { min: 5, score: 60 },
    { min: 4, score: 50 },
    { min: 3, score: 40 },
    { min: 2, score: 30 },
    { min: 1, score: 20 },
    { min: 0, score: 10 },
  ];
  
  let score = 0;
  let bonus = 0;
  
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  // 加分：超过14次，每多1次加1分，最多10分
  if (value > 14) {
    bonus = Math.min(value - 14, 10);
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.pullUps).toFixed(2)),
    level: getLevel(score),
    bonus,
  };
}

// 仰卧起坐评分 - 女生
function calculateSitUps(value: number): ScoreResult {
  const scores = [
    { min: 51, score: 100 },
    { min: 49, score: 95 },
    { min: 47, score: 90 },
    { min: 44, score: 85 },
    { min: 41, score: 80 },
    { min: 39, score: 78 },
    { min: 37, score: 76 },
    { min: 35, score: 74 },
    { min: 33, score: 72 },
    { min: 31, score: 70 },
    { min: 29, score: 68 },
    { min: 27, score: 66 },
    { min: 25, score: 64 },
    { min: 23, score: 62 },
    { min: 21, score: 60 },
    { min: 19, score: 50 },
    { min: 17, score: 40 },
    { min: 15, score: 30 },
    { min: 13, score: 20 },
    { min: 11, score: 10 },
  ];
  
  let score = 0;
  let bonus = 0;
  
  for (const item of scores) {
    if (value >= item.min) {
      score = item.score;
      break;
    }
  }
  
  // 加分：超过51次
  // 52-62次：每多2次加1分
  // 63次以上：每多1次加1分
  // 最多加10分
  if (value > 51) {
    if (value <= 62) {
      bonus = Math.floor((value - 51) / 2);
    } else {
      bonus = Math.floor((62 - 51) / 2) + (value - 62);
    }
    bonus = Math.min(bonus, 10);
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.sitUps).toFixed(2)),
    level: getLevel(score),
    bonus,
  };
}

// 1000米跑评分 - 男生 (秒)
function calculateRun1000m(seconds: number): ScoreResult {
  // 转换为秒数比较
  const scores = [
    { max: 230, score: 100 }, // 3'50"
    { max: 235, score: 95 }, // 3'55"
    { max: 240, score: 90 }, // 4'00"
    { max: 247, score: 85 }, // 4'07"
    { max: 255, score: 80 }, // 4'15"
    { max: 260, score: 78 }, // 4'20"
    { max: 265, score: 76 }, // 4'25"
    { max: 270, score: 74 }, // 4'30"
    { max: 275, score: 72 }, // 4'35"
    { max: 280, score: 70 }, // 4'40"
    { max: 285, score: 68 }, // 4'45"
    { max: 290, score: 66 }, // 4'50"
    { max: 295, score: 64 }, // 4'55"
    { max: 300, score: 62 }, // 5'00"
    { max: 305, score: 60 }, // 5'05"
    { max: 325, score: 50 }, // 5'25"
    { max: 345, score: 40 }, // 5'45"
    { max: 365, score: 30 }, // 6'05"
    { max: 385, score: 20 }, // 6'25"
    { max: 405, score: 10 }, // 6'45"
  ];
  
  let score = 0;
  let bonus = 0;
  
  for (const item of scores) {
    if (seconds <= item.max) {
      score = item.score;
      break;
    }
  }
  
  // 加分：低于3'50"(230秒)
  // 3'30"-3'50"：每快4秒加1分
  // 3'15"-3'30"：每快3秒加1分
  // 最多加10分
  if (seconds < 230) {
    const savedSeconds = 230 - seconds;
    if (seconds >= 210) { // 3'30"-3'50"
      bonus = Math.floor(savedSeconds / 4);
    } else if (seconds >= 195) { // 3'15"-3'30"
      bonus = Math.floor((230 - 210) / 4) + Math.floor((210 - seconds) / 3);
    } else {
      bonus = 10; // 达到3'15"以内，加满10分
    }
    bonus = Math.min(bonus, 10);
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.run1000m).toFixed(2)),
    level: getLevel(score),
    bonus,
  };
}

// 800米跑评分 - 女生 (秒)
function calculateRun800m(seconds: number): ScoreResult {
  const scores = [
    { max: 210, score: 100 }, // 3'30"
    { max: 217, score: 95 }, // 3'37"
    { max: 224, score: 90 }, // 3'44"
    { max: 232, score: 85 }, // 3'52"
    { max: 240, score: 80 }, // 4'00"
    { max: 245, score: 78 }, // 4'05"
    { max: 250, score: 76 }, // 4'10"
    { max: 255, score: 74 }, // 4'15"
    { max: 260, score: 72 }, // 4'20"
    { max: 265, score: 70 }, // 4'25"
    { max: 270, score: 68 }, // 4'30"
    { max: 275, score: 66 }, // 4'35"
    { max: 280, score: 64 }, // 4'40"
    { max: 285, score: 62 }, // 4'45"
    { max: 290, score: 60 }, // 4'50"
    { max: 300, score: 50 }, // 5'00"
    { max: 310, score: 40 }, // 5'10"
    { max: 320, score: 30 }, // 5'20"
    { max: 330, score: 20 }, // 5'30"
    { max: 340, score: 10 }, // 5'40"
  ];
  
  let score = 0;
  let bonus = 0;
  
  for (const item of scores) {
    if (seconds <= item.max) {
      score = item.score;
      break;
    }
  }
  
  // 加分：低于3'30"(210秒)，每快5秒加1分，最多10分
  if (seconds < 210) {
    const savedSeconds = 210 - seconds;
    bonus = Math.min(Math.floor(savedSeconds / 5), 10);
  }
  
  return {
    score,
    weightedScore: parseFloat((score * WEIGHTS.run800m).toFixed(2)),
    level: getLevel(score),
    bonus,
  };
}

// 计算完整成绩
export function calculateFullScore(
  scores: TestScores,
  gender: Gender
): FullScoreResult {
  let result: Partial<FullScoreResult> = {};
  let totalWeightedScore = 0;
  let totalBonus = 0;

  if (gender === 'male') {
    // BMI
    if (scores.bmi) {
      result.bmi = calculateBMIMale(scores.bmi);
      totalWeightedScore += result.bmi.weightedScore;
    }
    // 肺活量
    if (scores.vitalCapacity) {
      result.vitalCapacity = calculateVitalCapacityMale(scores.vitalCapacity);
      totalWeightedScore += result.vitalCapacity.weightedScore;
    }
    // 50米跑
    if (scores.run50m) {
      result.run50m = calculateRun50mMale(scores.run50m);
      totalWeightedScore += result.run50m.weightedScore;
    }
    // 坐位体前屈
    if (scores.sittingForward !== undefined) {
      result.sittingForward = calculateSittingForwardMale(scores.sittingForward);
      totalWeightedScore += result.sittingForward.weightedScore;
    }
    // 立定跳远
    if (scores.standingLongJump) {
      result.standingLongJump = calculateStandingLongJumpMale(scores.standingLongJump);
      totalWeightedScore += result.standingLongJump.weightedScore;
    }
    // 引体向上
    if (scores.pullUps !== undefined) {
      result.pullUps = calculatePullUps(scores.pullUps);
      totalWeightedScore += result.pullUps.weightedScore;
      totalBonus += result.pullUps.bonus;
    }
    // 1000米跑
    if (scores.run1000m) {
      result.run1000m = calculateRun1000m(scores.run1000m);
      totalWeightedScore += result.run1000m.weightedScore;
      totalBonus += result.run1000m.bonus;
    }
  } else {
    // BMI
    if (scores.bmi) {
      result.bmi = calculateBMIFemale(scores.bmi);
      totalWeightedScore += result.bmi.weightedScore;
    }
    // 肺活量
    if (scores.vitalCapacity) {
      result.vitalCapacity = calculateVitalCapacityFemale(scores.vitalCapacity);
      totalWeightedScore += result.vitalCapacity.weightedScore;
    }
    // 50米跑
    if (scores.run50m) {
      result.run50m = calculateRun50mFemale(scores.run50m);
      totalWeightedScore += result.run50m.weightedScore;
    }
    // 坐位体前屈
    if (scores.sittingForward !== undefined) {
      result.sittingForward = calculateSittingForwardFemale(scores.sittingForward);
      totalWeightedScore += result.sittingForward.weightedScore;
    }
    // 立定跳远
    if (scores.standingLongJump) {
      result.standingLongJump = calculateStandingLongJumpFemale(scores.standingLongJump);
      totalWeightedScore += result.standingLongJump.weightedScore;
    }
    // 仰卧起坐
    if (scores.sitUps !== undefined) {
      result.sitUps = calculateSitUps(scores.sitUps);
      totalWeightedScore += result.sitUps.weightedScore;
      totalBonus += result.sitUps.bonus;
    }
    // 800米跑
    if (scores.run800m) {
      result.run800m = calculateRun800m(scores.run800m);
      totalWeightedScore += result.run800m.weightedScore;
      totalBonus += result.run800m.bonus;
    }
  }

  const totalScore = Math.min(totalWeightedScore + totalBonus, 120);

  return {
    ...result,
    totalScore: parseFloat(totalScore.toFixed(2)),
    totalLevel: getLevel(totalScore),
  } as FullScoreResult;
}

// 格式化时间显示 (秒 -> 分'秒")
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}'${secs.toString().padStart(2, '0')}"`;
}

// 解析时间输入 (分'秒" -> 秒)
export function parseTimeInput(input: string): number | null {
  const match = input.match(/(\d+)'(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return null;
}
