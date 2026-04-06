import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, ClipboardList, Calculator } from 'lucide-react';
import type { Student, TestItem, Gender, TestScores } from '@/types';
import { calculateBMI, formatTime, parseTimeInput } from '@/utils/scoreCalculator';
import { toast } from 'sonner';

interface ScoreEntryProps {
  students: Student[];
  selectedClassId: string | null;
  className?: string;
  records: { studentId: string; scores: TestScores }[];
  onUpdateRecord: (studentId: string, scores: Partial<TestScores>) => void;
}

const PROJECTS: { key: TestItem; label: string; unit: string; type: 'number' | 'time' }[] = [
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', type: 'number' },
  { key: 'vitalCapacity', label: '肺活量', unit: 'ml', type: 'number' },
  { key: 'run50m', label: '50米跑', unit: '秒', type: 'number' },
  { key: 'sittingForward', label: '坐位体前屈', unit: 'cm', type: 'number' },
  { key: 'standingLongJump', label: '立定跳远', unit: 'cm', type: 'number' },
  { key: 'pullUps', label: '引体向上', unit: '次', type: 'number' },
  { key: 'sitUps', label: '仰卧起坐', unit: '次', type: 'number' },
  { key: 'run800m', label: '800米跑', unit: "分'秒", type: 'time' },
  { key: 'run1000m', label: '1000米跑', unit: "分'秒", type: 'time' },
];

export function ScoreEntry({
  students,
  selectedClassId,
  className,
  records,
  onUpdateRecord,
}: ScoreEntryProps) {
  const [entryMode, setEntryMode] = useState<'byProject' | 'byStudent'>('byProject');
  const [selectedProject, setSelectedProject] = useState<TestItem>('standingLongJump');
  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [scores, setScores] = useState<Record<string, string>>({});
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');

  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const filteredStudents = useMemo(() => {
    if (entryMode === 'byProject') {
      return classStudents.filter(s => s.gender === selectedGender);
    }
    return classStudents;
  }, [classStudents, selectedGender, entryMode]);

  const getStudentRecord = (studentId: string) => {
    return records.find(r => r.studentId === studentId)?.scores || {};
  };

  const handleScoreChange = (studentId: string, value: string) => {
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveByProject = () => {
    let savedCount = 0;
    Object.entries(scores).forEach(([studentId, value]) => {
      if (value.trim()) {
        const project = PROJECTS.find(p => p.key === selectedProject);
        if (project) {
          let scoreValue: number | undefined;
          
          if (selectedProject === 'bmi') {
            // BMI通过身高体重计算
            return;
          } else if (project.type === 'time') {
            const seconds = parseTimeInput(value);
            if (seconds !== null) {
              scoreValue = seconds;
            }
          } else {
            scoreValue = parseFloat(value);
          }

          if (scoreValue !== undefined && !isNaN(scoreValue)) {
            onUpdateRecord(studentId, { [selectedProject]: scoreValue });
            savedCount++;
          }
        }
      }
    });

    if (savedCount > 0) {
      toast.success(`成功保存 ${savedCount} 条成绩`);
      setScores({});
    }
  };

  const handleSaveBMI = () => {
    let savedCount = 0;
    Object.entries(scores).forEach(([studentId, value]) => {
      if (value.trim()) {
        const [height, weight] = value.split(',').map(v => parseFloat(v.trim()));
        if (height && weight && !isNaN(height) && !isNaN(weight)) {
          const bmi = calculateBMI(height, weight);
          onUpdateRecord(studentId, { bmi, height, weight });
          savedCount++;
        }
      }
    });

    if (savedCount > 0) {
      toast.success(`成功保存 ${savedCount} 条BMI数据`);
      setScores({});
    }
  };

  const handleSaveByStudent = () => {
    if (!selectedStudentId) return;

    const newScores: Partial<TestScores> = {};
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    // BMI
    if (heightInput && weightInput) {
      const height = parseFloat(heightInput);
      const weight = parseFloat(weightInput);
      if (!isNaN(height) && !isNaN(weight)) {
        newScores.bmi = calculateBMI(height, weight);
        newScores.height = height;
        newScores.weight = weight;
      }
    }

    // 其他项目
    PROJECTS.forEach(project => {
      if (project.key === 'bmi') return;
      
      // 根据性别跳过不相关的项目
      if (student.gender === 'male' && (project.key === 'sitUps' || project.key === 'run800m')) return;
      if (student.gender === 'female' && (project.key === 'pullUps' || project.key === 'run1000m')) return;

      const value = scores[project.key];
      if (value && value.trim()) {
        if (project.type === 'time') {
          const seconds = parseTimeInput(value);
          if (seconds !== null) {
            (newScores as any)[project.key] = seconds;
          }
        } else {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            (newScores as any)[project.key] = numValue;
          }
        }
      }
    });

    onUpdateRecord(selectedStudentId, newScores);
    toast.success('成绩保存成功');
    setScores({});
    setHeightInput('');
    setWeightInput('');
  };

  const getProjectLabel = (key: TestItem) => {
    const project = PROJECTS.find(p => p.key === key);
    return project ? `${project.label} (${project.unit})` : key;
  };

  const getDisplayValue = (studentId: string, projectKey: TestItem) => {
    const record = getStudentRecord(studentId);
    const value = (record as any)[projectKey];
    if (value === undefined || value === null) return '';
    
    const project = PROJECTS.find(p => p.key === projectKey);
    if (project?.type === 'time') {
      return formatTime(value);
    }
    return value.toString();
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          成绩录入
          <span className="text-sm font-normal text-gray-500">({className})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={entryMode} onValueChange={(v) => setEntryMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="byProject">按项目录入</TabsTrigger>
            <TabsTrigger value="byStudent">按学生录入</TabsTrigger>
          </TabsList>

          <TabsContent value="byProject" className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v as TestItem)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="选择测试项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bmi">BMI (身高,体重)</SelectItem>
                  <SelectItem value="vitalCapacity">肺活量 (ml)</SelectItem>
                  <SelectItem value="run50m">50米跑 (秒)</SelectItem>
                  <SelectItem value="sittingForward">坐位体前屈 (cm)</SelectItem>
                  <SelectItem value="standingLongJump">立定跳远 (cm)</SelectItem>
                  <SelectItem value="pullUps">引体向上 (次)</SelectItem>
                  <SelectItem value="sitUps">仰卧起坐 (次)</SelectItem>
                  <SelectItem value="run800m">800米跑 (分'秒)</SelectItem>
                  <SelectItem value="run1000m">1000米跑 (分'秒)</SelectItem>
                </SelectContent>
              </Select>

              {selectedProject !== 'bmi' && (
                <Select value={selectedGender} onValueChange={(v) => setSelectedGender(v as Gender)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男生</SelectItem>
                    <SelectItem value="female">女生</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button onClick={selectedProject === 'bmi' ? handleSaveBMI : handleSaveByProject} className="gap-1">
                <Save className="w-4 h-4" />
                保存成绩
              </Button>
            </div>

            {selectedProject === 'bmi' ? (
              <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 mb-4">
                <Calculator className="w-4 h-4 inline mr-1" />
                BMI录入格式：身高,体重（如：170,60 表示身高170cm，体重60kg）
              </div>
            ) : (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-4">
                录入项目：{getProjectLabel(selectedProject)}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">序号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead className="w-32">当前成绩</TableHead>
                  <TableHead>录入成绩</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {student.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {student.gender === 'male' ? '男' : '女'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {selectedProject === 'bmi' ? (
                        (() => {
                          const record = getStudentRecord(student.id);
                          return record.bmi ? `${record.bmi} (${record.height}cm, ${record.weight}kg)` : '-';
                        })()
                      ) : (
                        getDisplayValue(student.id, selectedProject) || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        className="w-40"
                        placeholder={selectedProject === 'bmi' ? '身高,体重' : '输入成绩'}
                        value={scores[student.id] || ''}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="byStudent" className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="选择学生" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.gender === 'male' ? '男' : '女'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSaveByStudent} className="gap-1">
                <Save className="w-4 h-4" />
                保存成绩
              </Button>
            </div>

            {selectedStudentId && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* BMI */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">BMI</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex gap-2">
                      <Input
                        placeholder="身高(cm)"
                        value={heightInput}
                        onChange={(e) => setHeightInput(e.target.value)}
                      />
                      <Input
                        placeholder="体重(kg)"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                      />
                    </div>
                    {(() => {
                      const record = getStudentRecord(selectedStudentId);
                      return record.bmi ? (
                        <p className="text-sm text-gray-500">当前: {record.bmi} ({record.height}cm, {record.weight}kg)</p>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>

                {/* 其他项目 */}
                {PROJECTS.filter(p => {
                  const student = students.find(s => s.id === selectedStudentId);
                  if (!student) return false;
                  if (p.key === 'bmi') return false;
                  if (student.gender === 'male' && (p.key === 'sitUps' || p.key === 'run800m')) return false;
                  if (student.gender === 'female' && (p.key === 'pullUps' || p.key === 'run1000m')) return false;
                  return true;
                }).map(project => (
                  <Card key={project.key}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">
                        {project.label} ({project.unit})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Input
                        placeholder={`输入${project.label}`}
                        value={scores[project.key] || ''}
                        onChange={(e) => setScores(prev => ({ ...prev, [project.key]: e.target.value }))}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        当前: {getDisplayValue(selectedStudentId, project.key) || '-'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
