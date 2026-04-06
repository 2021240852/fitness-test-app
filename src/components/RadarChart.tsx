import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, User, Radar as RadarIcon } from 'lucide-react';
import { 
  RadarChart as ReRadarChart, 
  Radar as ReRadar,
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import type { Student, TestScores } from '@/types';
import { calculateFullScore } from '@/utils/scoreCalculator';

interface RadarChartProps {
  students: Student[];
  selectedClassId: string | null;
  className?: string;
  records: { studentId: string; scores: TestScores }[];
}

interface RadarData {
  subject: string;
  score: number;
  fullMark: number;
}

export function ScoreRadarChart({
  students,
  selectedClassId,
  className,
  records,
}: RadarChartProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [compareStudentId, setCompareStudentId] = useState<string>('');
  const [showCompare, setShowCompare] = useState(false);

  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const getStudentRecord = (studentId: string) => {
    return records.find(r => r.studentId === studentId)?.scores || {};
  };

  const generateRadarData = (studentId: string): RadarData[] => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];

    const scores = getStudentRecord(studentId);
    const result = calculateFullScore(scores, student.gender);

    const data: RadarData[] = [
      { subject: 'BMI', score: result.bmi?.score || 0, fullMark: 100 },
      { subject: '肺活量', score: result.vitalCapacity?.score || 0, fullMark: 100 },
      { subject: '50米跑', score: result.run50m?.score || 0, fullMark: 100 },
      { subject: '坐位体前屈', score: result.sittingForward?.score || 0, fullMark: 100 },
      { subject: '立定跳远', score: result.standingLongJump?.score || 0, fullMark: 100 },
    ];

    if (student.gender === 'male') {
      data.push(
        { subject: '引体向上', score: result.pullUps?.score || 0, fullMark: 100 },
        { subject: '1000米跑', score: result.run1000m?.score || 0, fullMark: 100 }
      );
    } else {
      data.push(
        { subject: '仰卧起坐', score: result.sitUps?.score || 0, fullMark: 100 },
        { subject: '800米跑', score: result.run800m?.score || 0, fullMark: 100 }
      );
    }

    return data;
  };

  const radarData = useMemo(() => {
    if (!selectedStudentId) return [];
    return generateRadarData(selectedStudentId);
  }, [selectedStudentId, records]);

  const compareData = useMemo(() => {
    if (!compareStudentId || !showCompare) return [];
    return generateRadarData(compareStudentId);
  }, [compareStudentId, showCompare, records]);

  const combinedData = useMemo(() => {
    if (radarData.length === 0) return [];
    
    return radarData.map((item, index) => ({
      subject: item.subject,
      当前学生: item.score,
      对比学生: compareData[index]?.score || 0,
      fullMark: 100,
    }));
  }, [radarData, compareData]);

  const getScoreInfo = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const scores = getStudentRecord(studentId);
    const result = calculateFullScore(scores, student.gender);

    return {
      totalScore: result.totalScore,
      totalLevel: result.totalLevel,
      student,
    };
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'excellent': return '优秀';
      case 'good': return '良好';
      case 'pass': return '及格';
      case 'fail': return '不及格';
      default: return '-';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'pass': return 'text-yellow-600 bg-yellow-100';
      case 'fail': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!selectedClassId) {
    return (
      <Card className="w-full">
        <CardContent className="py-12 text-center text-gray-500">
          请先选择一个班级
        </CardContent>
      </Card>
    );
  }

  const selectedInfo = selectedStudentId ? getScoreInfo(selectedStudentId) : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <RadarIcon className="w-5 h-5" />
          成绩雷达图
          <span className="text-sm font-normal text-gray-500">({className})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="选择学生查看成绩" />
            </SelectTrigger>
            <SelectContent>
              {classStudents.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.gender === 'male' ? '男' : '女'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <TrendingUp className="w-4 h-4" />
                对比分析
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>成绩对比分析</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Select value={compareStudentId} onValueChange={setCompareStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择对比学生" />
                  </SelectTrigger>
                  <SelectContent>
                    {classStudents
                      .filter(s => s.id !== selectedStudentId)
                      .map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.gender === 'male' ? '男' : '女'})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => setShowCompare(true)} 
                  disabled={!compareStudentId}
                  className="w-full"
                >
                  开始对比
                </Button>

                {showCompare && compareStudentId && (
                  <div className="mt-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReRadarChart data={combinedData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <ReRadar
                            name={students.find(s => s.id === selectedStudentId)?.name}
                            dataKey="当前学生"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                          <ReRadar
                            name={students.find(s => s.id === compareStudentId)?.name}
                            dataKey="对比学生"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.3}
                          />
                        </ReRadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedStudentId && radarData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ReRadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}分`, '得分']}
                      labelFormatter={(label) => label}
                    />
                    <ReRadar
                      name="得分"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                  </ReRadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              {selectedInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{selectedInfo.student.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${selectedInfo.student.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {selectedInfo.student.gender === 'male' ? '男' : '女'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">总分</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedInfo.totalScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">等级</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedInfo.totalLevel)}`}>
                        {getLevelText(selectedInfo.totalLevel)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">各项目得分</h4>
                {radarData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.score >= 90 ? 'bg-green-500' :
                            item.score >= 80 ? 'bg-blue-500' :
                            item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            请选择学生查看成绩雷达图
          </div>
        )}
      </CardContent>
    </Card>
  );
}
