export const typeLabel = {
  ALL: '전체',
  MAJOR: '전공',
  GENERAL: '교양',
};

export function getTotalCredits(courseIds, courses) {
  return courseIds.reduce((sum, id) => {
    const course = courses.find((item) => item.id === id);
    return sum + (course?.credits || 0);
  }, 0);
}

export function hasTimeConflict(targetCourse, enrolledCourseIds, courses) {
  return enrolledCourseIds.some((id) => {
    const enrolled = courses.find((course) => course.id === id);
    if (!enrolled) return false;

    return targetCourse.slots.some((slot) =>
      enrolled.slots.some(
        (enrolledSlot) => enrolledSlot.day === slot.day && enrolledSlot.period === slot.period,
      ),
    );
  });
}

export function getUnavailableReason(targetCourse, enrolledCourseIds, courses, maxCredits) {
  if (enrolledCourseIds.includes(targetCourse.id)) return '';

  const currentCredits = getTotalCredits(enrolledCourseIds, courses);
  if (currentCredits + targetCourse.credits > maxCredits) {
    return `최대 신청 가능 학점 ${maxCredits}학점을 초과합니다.`;
  }

  if (hasTimeConflict(targetCourse, enrolledCourseIds, courses)) {
    return '이미 신청한 과목과 시간이 겹칩니다.';
  }

  if (targetCourse.appliedCount >= targetCourse.capacity) {
    return '정원이 마감되었습니다.';
  }

  return '';
}

export function canApplyCourse(targetCourse, enrolledCourseIds, courses, maxCredits) {
  return !getUnavailableReason(targetCourse, enrolledCourseIds, courses, maxCredits);
}

export function getScheduleCell(day, period, enrolledCourseIds, courses) {
  return enrolledCourseIds
    .map((id) => courses.find((course) => course.id === id))
    .filter(Boolean)
    .find((course) => course.slots.some((slot) => slot.day === day && slot.period === period));
}
