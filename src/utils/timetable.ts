interface ClassInfo {
  subject: string;
  type: string;
}

export const schedule: Record<string, Record<string, ClassInfo>> = {
  'Monday': {
    '08:30 - 09:20': { subject: 'Operational Research', type: 'lecture' },
    '09:20 - 10:10': { subject: 'Software Engineering', type: 'lecture' },
    '10:10 - 11:00': { subject: 'Operating System', type: 'lecture' },
    '11:00 - 11:20': { subject: 'Break', type: 'break' },
    '11:20 - 12:10': { subject: 'Data Visualization', type: 'lecture' },
    '12:10 - 01:00': { subject: 'Seminars/Quiz', type: 'seminar' },
    '01:00 - 01:50': { subject: 'Seminars/Quiz', type: 'seminar' }
  },
  'Tuesday': {
    '08:30 - 09:20': { subject: 'Operating System', type: 'lecture' },
    '09:20 - 10:10': { subject: 'Operational Research', type: 'lecture' },
    '10:10 - 11:00': { subject: 'Data Visualization', type: 'lecture' },
    '11:00 - 11:20': { subject: 'Break', type: 'break' },
    '11:20 - 12:10': { subject: 'Machine Learning', type: 'lecture' },
    '12:10 - 01:00': { subject: 'Seminars', type: 'seminar' },
    '01:00 - 01:50': { subject: 'Software Engineering', type: 'lecture' }
  },
  'Wednesday': {
    '08:30 - 09:20': { subject: 'Operating System', type: 'lecture' },
    '09:20 - 10:10': { subject: 'Operational Research', type: 'lecture' },
    '10:10 - 11:00': { subject: 'Software Engineering', type: 'lecture' },
    '11:00 - 11:20': { subject: 'Break', type: 'break' },
    '11:20 - 12:10': { subject: 'Machine Learning', type: 'lecture' },
    '12:10 - 01:00': { subject: 'Seminars/Quiz', type: 'seminar' },
    '01:00 - 01:50': { subject: 'Seminars/Quiz', type: 'seminar' }
  },
  'Thursday': {
    '08:30 - 09:20': { subject: 'Constitution of India', type: 'lecture' },
    '09:20 - 10:10': { subject: 'Operating System', type: 'lecture' },
    '10:10 - 11:00': { subject: 'Data Visualization', type: 'lecture' },
    '11:00 - 11:20': { subject: 'Break', type: 'break' },
    '11:20 - 12:10': { subject: 'Machine Learning', type: 'lecture' },
    '12:10 - 01:00': { subject: 'II BT OS LAB[ ] I BT DATA VISU.LAB[ ]', type: 'lab' },
    '01:00 - 01:50': { subject: 'II BT OS LAB[ ] I BT DATA VISU.LAB[ ]', type: 'lab' }
  },
  'Friday': {
    '08:30 - 09:20': { subject: 'Operational Research', type: 'lecture' },
    '09:20 - 10:10': { subject: 'Data Visualization', type: 'lecture' },
    '10:10 - 11:00': { subject: 'Constitution of India', type: 'lecture' },
    '11:00 - 11:20': { subject: 'Break', type: 'break' },
    '11:20 - 12:10': { subject: 'Machine Learning', type: 'lecture' },
    '12:10 - 01:00': { subject: 'I BT OS LAB[ ] II BT DATA VISU.LAB[ ]', type: 'lab' },
    '01:00 - 01:50': { subject: 'I BT OS LAB[ ] II BT DATA VISU.LAB[ ]', type: 'lab' }
  }
};

export const getCurrentDaySchedule = () => {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return schedule[currentDay] || {};
};

export const getTodayClassCount = () => {
  const todaySchedule = getCurrentDaySchedule();
  return Object.values(todaySchedule).filter(classInfo => classInfo.type !== 'break').length;
};

export const getNextClass = () => {
  const todaySchedule = getCurrentDaySchedule();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  const timeSlots = [
    '08:30 - 09:20',
    '09:20 - 10:10', 
    '10:10 - 11:00',
    '11:00 - 11:20',
    '11:20 - 12:10',
    '12:10 - 01:00',
    '01:00 - 01:50'
  ];
  
  for (const slot of timeSlots) {
    const [startTime] = slot.split(' - ');
    const [hour, minute] = startTime.split(':').map(Number);
    
    if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
      const classInfo = todaySchedule[slot];
      if (classInfo && classInfo.type !== 'break') {
        return `${classInfo.subject} at ${startTime}`;
      }
    }
  }
  
  return 'No more classes today';
};