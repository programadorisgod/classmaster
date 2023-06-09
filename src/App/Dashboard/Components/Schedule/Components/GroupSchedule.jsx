import moment from "moment";
import 'moment/locale/es';
import { useState } from "react";
import { useEffect } from "react";

moment.locale('es');

export function GroupSchedule({ group, schedule, groupCount }) {
    const [time, setTime] = useState({starTime: schedule.starTime, endTime: schedule.endTime})
    useEffect(() => {
        setTime({starTime: moment(schedule.starTime, 'HH:mm').format('h:mm A'), endTime: moment(schedule.endTime, 'HH:mm').format('h:mm A')})
    }, [schedule])

  return (<div className={`schedule-subject__day-content ${groupCount == 1 ? "subject-single-schedule__child" : ""}`}>
    <div className="schedule-subject__day-group">
      <p className="day-group-time">{time.starTime}</p>
      <p className="day-group-time">{" - "}</p>
      <p className="day-group-time">{time.endTime}</p>
      <p className="day-group">{`Grupo: ${group}`}</p>
    </div>
  </div>
    
  );
}
