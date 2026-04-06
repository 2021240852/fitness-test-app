import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, Download, Eye, BarChart3 } from 'lucide-react';
import type { Student } from '@/types';
import { calculateFullScore, formatTime } from '@/utils/scoreCalculator';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ScoreExportProps {
  students: Student[];
  selectedClassId: string | null;
  className?: string;
  records: { studentId: string; scores: any }[];
}

const getLevelText = (level: string): string => {
  switch (level) {
    case 'excellent': return '优秀';
    case 'good': return '良好';
    case 'pass': return '及格';
    case 'fail': return '不及格';
    default: return '-';
  }
};

const getLevelBadge = (level: string) => {
  switch (level) {
    case '优秀':
      return <Badge className="bg-green-500">优秀</Badge>;
    case '良好':
      return <Badge className="bg-blue-500">良好</Badge>;
    case '及格':
      return <Badge className="bg-yellow-500">及格</Badge>;
    case '不及格':
      return <Badge className="bg-red-500">不及格</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

export function ScoreExport({
  students,
  selectedClassId,
  className,
  records,
}: ScoreExportProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'stats'>('preview');

  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const getStudentRecord = (studentId: string) => {
    return records.find(r => r.studentId === studentId)?.scores || {};
  };

  const exportData = useMemo(() => {
    if (classStudents.length === 0) return [];
    
    return classStudents.map((student, index) => {
      const scores = getStudentRecord(student.id);
      const result = calculateFullScore(scores, student.gender);
      const isMale = student.gender === 'male';

      const data: any = {
        序号: index + 1,
        姓名: student.name,
        性别: isMale ? '男' : '女',
        BMI: scores.bmi || '-',
        BMI得分: result.bmi?.score || 0,
        肺活量: scores.vitalCapacity || '-',
        肺活量得分: result.vitalCapacity?.score || 0,
        '50米跑': scores.run50m || '-',
        '50米跑得分': result.run50m?.score || 0,
        坐位体前屈: scores.sittingForward !== undefined ? scores.sittingForward : '-',
        坐位体前屈得分: result.sittingForward?.score || 0,
        立定跳远: scores.standingLongJump || '-',
        立定跳远得分: result.standingLongJump?.score || 0,
        总分: result.totalScore || 0,
        等级: getLevelText(result.totalLevel),
      };

      if (isMale) {
        data['引体向上'] = scores.pullUps !== undefined ? scores.pullUps : '-';
        data['引体向上得分'] = result.pullUps?.score || 0;
        data['1000米跑'] = scores.run1000m ? formatTime(scores.run1000m) : '-';
        data['1000米跑得分'] = result.run1000m?.score || 0;
      } else {
        data['仰卧起坐'] = scores.sitUps !== undefined ? scores.sitUps : '-';
        data['仰卧起坐得分'] = result.sitUps?.score || 0;
        data['800米跑'] = scores.run800m ? formatTime(scores.run800m) : '-';
        data['800米跑得分'] = result.run800m?.score || 0;
      }

      return data;
    });
  }, [classStudents, records]);

  const statistics = useMemo(() => {
    if (exportData.length === 0) return null;

    const totalScores = exportData.map(d => d.总分);
    const avgScore = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
    const maxScore = Math.max(...totalScores);
    const minScore = Math.min(...totalScores);

    const levelCounts = {
      优秀: exportData.filter(d => d.等级 === '优秀').length,
      良好: exportData.filter(d => d.等级 === '良好').length,
      及格: exportData.filter(d => d.等级 === '及格').length,
      不及格: exportData.filter(d => d.等级 === '不及格').length,
    };

    const maleCount = exportData.filter(d => d.性别 === '男').length;
    const femaleCount = exportData.filter(d => d.性别 === '女').length;

    return {
      avgScore: avgScore.toFixed(2),
      maxScore,
      minScore,
      levelCounts,
      maleCount,
      femaleCount,
      totalCount: exportData.length,
    };
  }, [exportData]);

  const handleExportExcel = () => {
    if (exportData.length === 0) {
      toast.error('没有可导出的数据');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '体质健康测试成绩');
      
      const fileName = `${className || '班级'}_体质健康测试成绩_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Excel文件已导出');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('导出失败，请重试');
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          成绩导出
          <span className="text-sm font-normal text-gray-500">({className || '未选择'})</span>
        </CardTitle>
        <Button onClick={handleExportExcel} className="gap-1" disabled={exportData.length === 0}>
          <Download className="w-4 h-4" />
          导出Excel
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'stats')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="preview" className="gap-1">
              <Eye className="w-4 h-4" />
              成绩预览
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1">
              <BarChart3 className="w-4 h-4" />
              统计分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            {exportData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无成绩数据
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">序号</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>性别</TableHead>
                      <TableHead>BMI</TableHead>
                      <TableHead>肺活量</TableHead>
                      <TableHead>50米</TableHead>
                      <TableHead>坐位体前屈</TableHead>
                      <TableHead>立定跳远</TableHead>
                      <TableHead>引体向上/仰卧起坐</TableHead>
                      <TableHead>800/1000米</TableHead>
                      <TableHead>总分</TableHead>
                      <TableHead>等级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{data.序号}</TableCell>
                        <TableCell className="font-medium">{data.姓名}</TableCell>
                        <TableCell>{data.性别}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data.BMI}</div>
                            <div className="text-gray-400">{data.BMI得分}分</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data.肺活量}</div>
                            <div className="text-gray-400">{data.肺活量得分}分</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data['50米跑']}</div>
                            <div className="text-gray-400">{data['50米跑得分']}分</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data.坐位体前屈}</div>
                            <div className="text-gray-400">{data.坐位体前屈得分}分</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data.立定跳远}</div>
                            <div className="text-gray-400">{data.立定跳远得分}分</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data['引体向上'] || data['仰卧起坐'] || '-'}</div>
                            <div className="text-gray-400">
                              {data['引体向上得分'] || data['仰卧起坐得分'] || 0}分
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{data['800米跑'] || data['1000米跑'] || '-'}</div>
                            <div className="text-gray-400">
                              {data['800米跑得分'] || data['1000米跑得分'] || 0}分
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-blue-600">{data.总分}</TableCell>
                        <TableCell>{getLevelBadge(data.等级)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            {statistics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">{statistics.totalCount}</div>
                    <div className="text-sm text-gray-600 mt-1">总人数</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">{statistics.avgScore}</div>
                    <div className="text-sm text-gray-600 mt-1">平均分</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">{statistics.maxScore}</div>
                    <div className="text-sm text-gray-600 mt-1">最高分</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-600">{statistics.minScore}</div>
                    <div className="text-sm text-gray-600 mt-1">最低分</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">性别分布</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">男生</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(statistics.maleCount / statistics.totalCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{statistics.maleCount}人</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">女生</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-pink-500 rounded-full"
                              style={{ width: `${(statistics.femaleCount / statistics.totalCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{statistics.femaleCount}人</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4">等级分布</h4>
                    <div className="space-y-3">
                      {Object.entries(statistics.levelCounts).map(([level, count]) => (
                        <div key={level} className="flex justify-between items-center">
                          <span className="text-gray-600">{level}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  level === '优秀' ? 'bg-green-500' :
                                  level === '良好' ? 'bg-blue-500' :
                                  level === '及格' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(count / statistics.totalCount) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{count}人</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无统计数据
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
