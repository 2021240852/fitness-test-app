import { useState, useEffect, useCallback } from 'react';
import type { Class, Student, StudentRecord } from '@/types';

const CLASSES_KEY = 'fitness_classes';
const STUDENTS_KEY = 'fitness_students';
const RECORDS_KEY = 'fitness_records';

// 班级管理
export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CLASSES_KEY);
    if (stored) {
      try {
        setClasses(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse classes:', e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
    }
  }, [classes, loaded]);

  const addClass = useCallback((name: string) => {
    const newClass: Class = {
      id: Date.now().toString(),
      name,
    };
    setClasses(prev => [...prev, newClass]);
    return newClass.id;
  }, []);

  const updateClass = useCallback((id: string, name: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  }, []);

  const deleteClass = useCallback((id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  }, []);

  return { classes, addClass, updateClass, deleteClass, loaded };
}

// 学生管理
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STUDENTS_KEY);
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse students:', e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    }
  }, [students, loaded]);

  const addStudent = useCallback((name: string, gender: 'male' | 'female', classId: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      gender,
      classId,
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent.id;
  }, []);

  const addStudents = useCallback((newStudents: Omit<Student, 'id'>[]) => {
    const studentsWithId = newStudents.map((s, index) => ({
      ...s,
      id: `${Date.now()}_${index}`,
    }));
    setStudents(prev => [...prev, ...studentsWithId]);
    return studentsWithId.map(s => s.id);
  }, []);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  const deleteStudentsByClass = useCallback((classId: string) => {
    setStudents(prev => prev.filter(s => s.classId !== classId));
  }, []);

  const getStudentsByClass = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId);
  }, [students]);

  return { 
    students, 
    addStudent, 
    addStudents, 
    updateStudent, 
    deleteStudent, 
    deleteStudentsByClass,
    getStudentsByClass,
    loaded 
  };
}

// 成绩记录管理
export function useRecords() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(RECORDS_KEY);
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse records:', e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    }
  }, [records, loaded]);

  const getRecord = useCallback((studentId: string) => {
    return records.find(r => r.studentId === studentId);
  }, [records]);

  const updateRecord = useCallback((studentId: string, scores: Partial<StudentRecord['scores']>) => {
    setRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId);
      if (existing) {
        return prev.map(r => 
          r.studentId === studentId 
            ? { ...r, scores: { ...r.scores, ...scores } }
            : r
        );
      } else {
        return [...prev, { studentId, scores }];
      }
    });
  }, []);

  const deleteRecord = useCallback((studentId: string) => {
    setRecords(prev => prev.filter(r => r.studentId !== studentId));
  }, []);

  const deleteRecordsByClass = useCallback((classId: string, students: Student[]) => {
    const studentIds = students.filter(s => s.classId === classId).map(s => s.id);
    setRecords(prev => prev.filter(r => !studentIds.includes(r.studentId)));
  }, []);

  return { 
    records, 
    getRecord, 
    updateRecord, 
    deleteRecord, 
    deleteRecordsByClass,
    loaded 
  };
}
