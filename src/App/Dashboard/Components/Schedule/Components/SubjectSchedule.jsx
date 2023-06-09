import { GroupSchedule } from "./GroupSchedule";
import { useEffect, useState } from "react";

export function SubjectSchedule({ subject }) {
  const [groupCounts, setGroupCounts] = useState({});

  useEffect(() => {
    const counts = {};
    subject.groups.map((group) => {
      group.schedule.map((schedule) => {
        const { day } = schedule;
        counts[day] = (counts[day] || 0) + 1;
      });
    });
    setGroupCounts(counts);
  }, []);

  const renderGroupSchedules = (day) => {
    const groupSchedules = [];
    subject.groups.map((group, i) => {
      group.schedule.map((schedule, j) => {
        if (schedule.day === day) {
          const key = `${i}${j}`;
          groupSchedules.push(
            <GroupSchedule
              key={key}
              group={group.name}
              schedule={schedule}
              groupCount={groupCounts[day]}
            />
          );
        }
      });
    });
    return groupSchedules;
  };

  return (
    <div className="schedule-subject">
      <div className="schedule-subject__title schedule-subject__child">
        <h4>{subject.name}</h4>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Lunes"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Lunes")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Martes"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Martes")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Miércoles"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Miércoles")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Jueves"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Jueves")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Viernes"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Viernes")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Sábado"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Sábado")}</div>
      </div>
      <div className={`schedule-subject__day schedule-subject__child ${groupCounts["Domingo"] == 1 ? "subject-single-schedule" : "" }`}>
        <div className="schedule-subject__day-box">{renderGroupSchedules("Domingo")}</div>
      </div>
    </div>
  );
}
