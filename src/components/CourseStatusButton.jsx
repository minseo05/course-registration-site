export default function CourseStatusButton({ course, isEnrolled, reason, onApply, onCancel }) {
  if (isEnrolled) {
    return (
      <button className="danger-button small" type="button" onClick={() => onCancel(course.id)}>
        취소
      </button>
    );
  }

  if (reason) {
    return (
      <span className="tooltip-wrap">
        <button className="disabled-button small" type="button" aria-label={`신청 불가: ${reason}`}>
          불가
        </button>
        <span className="tooltip-text">{reason}</span>
      </span>
    );
  }

  return (
    <button className="primary-button small" type="button" onClick={() => onApply(course.id)}>
      신청
    </button>
  );
}
