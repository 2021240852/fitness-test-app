import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, Edit2, Trash2, UserPlus, Download } from 'lucide-react';
import type { Student, Gender } from '@/types';
import { toast } from 'sonner';

interface StudentManagerProps {
  students: Student[];
  selectedClassId: string | null;
  className?: string;
  onAddStudent: (name: string, gender: Gender) => void;
  onAddStudents: (students: { name: string; gender: Gender; classId: string }[]) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentManager({
  students,
  selectedClassId,
  className,
  onAddStudent,
  onAddStudents,
  onUpdateStudent,
  onDeleteStudent,
}: StudentManagerProps) {
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<Gender>('male');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<Gender>('male');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importGender, setImportGender] = useState<Gender>('male');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classStudents = selectedClassId
    ? students.filter(s => s.classId === selectedClassId)
    : [];

  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedClassId) {
      onAddStudent(newStudentName.trim(), newStudentGender);
      setNewStudentName('');
      setNewStudentGender('male');
      setIsAddDialogOpen(false);
      toast.success('学生添加成功');
    }
  };

  const handleUpdateStudent = () => {
    if (editingStudent && editName.trim()) {
      onUpdateStudent(editingStudent.id, { name: editName.trim(), gender: editGender });
      setEditingStudent(null);
      toast.success('学生信息更新成功');
    }
  };

  const handleImport = () => {
    if (!importText.trim() || !selectedClassId) return;

    const lines = importText.split('\n').filter(line => line.trim());
    const newStudents = lines.map(name => ({
      name: name.trim(),
      gender: importGender,
      classId: selectedClassId,
    }));

    onAddStudents(newStudents);
    setImportText('');
    setIsImportDialogOpen(false);
    toast.success(`成功导入 ${newStudents.length} 名学生`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClassId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        toast.success('文件读取成功，请确认导入');
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = '张三\n李四\n王五\n赵六\n';
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '学生名单模板.txt';
    a.click();
    URL.revokeObjectURL(url);
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
          <UserPlus className="w-5 h-5" />
          学生管理
          <span className="text-sm font-normal text-gray-500">
            ({className} - {classStudents.length}人)
          </span>
        </CardTitle>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="w-4 h-4" />
                批量导入
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>批量导入学生</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Select value={importGender} onValueChange={(v) => setImportGender(v as Gender)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男生</SelectItem>
                      <SelectItem value="female">女生</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={downloadTemplate} className="gap-1">
                    <Download className="w-4 h-4" />
                    下载模板
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    选择文件
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <textarea
                  className="w-full h-48 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="每行输入一个学生姓名，如：&#10;张三&#10;李四&#10;王五"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    预计导入: {importText.split('\n').filter(l => l.trim()).length} 人
                  </span>
                  <Button onClick={handleImport} disabled={!importText.trim()}>
                    确认导入
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                添加学生
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加学生</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="请输入学生姓名"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                />
                <Select value={newStudentGender} onValueChange={(v) => setNewStudentGender(v as Gender)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddStudent} className="w-full">
                  确认添加
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {classStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无学生，请点击"添加学生"或"批量导入"
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">序号</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>性别</TableHead>
                <TableHead className="w-24 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      student.gender === 'male' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {student.gender === 'male' ? '男' : '女'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingStudent(student);
                              setEditName(student.name);
                              setEditGender(student.gender);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>修改学生信息</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateStudent()}
                            />
                            <Select value={editGender} onValueChange={(v) => setEditGender(v as Gender)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">男</SelectItem>
                                <SelectItem value="female">女</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateStudent} className="w-full">
                              确认修改
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除学生</AlertDialogTitle>
                            <AlertDialogDescription>
                              删除学生将同时删除该学生的所有成绩记录，此操作不可恢复。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteStudent(student.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              确认删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
