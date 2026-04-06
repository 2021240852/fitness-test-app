import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';
import { ClassManager } from '@/components/ClassManager';
import { StudentManager } from '@/components/StudentManager';
import { ScoreEntry } from '@/components/ScoreEntry';
import { ScoreRadarChart } from '@/components/RadarChart';
import { ScoreExport } from '@/components/ScoreExport';
import { useClasses, useStudents, useRecords } from '@/hooks/useStorage';
import { Users, UserPlus, ClipboardList, Radar, FileSpreadsheet, GraduationCap } from 'lucide-react';

function App() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('classes');

  const { classes, addClass, updateClass, deleteClass } = useClasses();
  const { 
    students, 
    addStudent, 
    addStudents, 
    updateStudent, 
    deleteStudent, 
    deleteStudentsByClass
  } = useStudents();
  const { records, updateRecord, deleteRecord, deleteRecordsByClass } = useRecords();

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleDeleteClass = (id: string) => {
    deleteStudentsByClass(id);
    deleteRecordsByClass(id, students);
    deleteClass(id);
    if (selectedClassId === id) {
      setSelectedClassId(null);
    }
    toast.success('班级已删除');
  };

  const handleAddStudent = (name: string, gender: 'male' | 'female') => {
    if (selectedClassId) {
      addStudent(name, gender, selectedClassId);
    }
  };

  const handleAddStudents = (newStudents: { name: string; gender: 'male' | 'female'; classId: string }[]) => {
    addStudents(newStudents);
  };

  const handleDeleteStudent = (id: string) => {
    deleteRecord(id);
    deleteStudent(id);
    toast.success('学生已删除');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">八年级国家体质健康测试系统</h1>
              <p className="text-sm text-gray-500">学生体质健康测试数据管理与分析平台</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-14">
            <TabsTrigger value="classes" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">班级管理</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">学生管理</span>
            </TabsTrigger>
            <TabsTrigger value="entry" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">成绩录入</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="gap-2">
              <Radar className="w-4 h-4" />
              <span className="hidden sm:inline">雷达图</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">成绩导出</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <ClassManager
              classes={classes}
              students={students}
              onAddClass={addClass}
              onUpdateClass={updateClass}
              onDeleteClass={handleDeleteClass}
              onSelectClass={setSelectedClassId}
              selectedClassId={selectedClassId}
            />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <StudentManager
              students={students}
              selectedClassId={selectedClassId}
              className={selectedClass?.name}
              onAddStudent={handleAddStudent}
              onAddStudents={handleAddStudents}
              onUpdateStudent={updateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          </TabsContent>

          <TabsContent value="entry" className="space-y-4">
            <ScoreEntry
              students={students}
              selectedClassId={selectedClassId}
              className={selectedClass?.name}
              records={records}
              onUpdateRecord={updateRecord}
            />
          </TabsContent>

          <TabsContent value="radar" className="space-y-4">
            <ScoreRadarChart
              students={students}
              selectedClassId={selectedClassId}
              className={selectedClass?.name}
              records={records}
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <ScoreExport
              students={students}
              selectedClassId={selectedClassId}
              className={selectedClass?.name}
              records={records}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            八年级国家体质健康测试系统 © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
