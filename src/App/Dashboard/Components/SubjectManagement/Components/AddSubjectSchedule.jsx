import { useState, useEffect } from 'react'

export function AddSubjectSchedule ({handleSetSchedule, scheduleData, index, disable}) {
  const [schedule, setSchedule] = useState(scheduleData)

  const handleTime = (event) => {
    if (event.target.name == "starTime") {
      validateTime(event.target.value, schedule.endTime) && setSchedule({...schedule, [event.target.name]: event.target.value})
    } else if (event.target.name == "endTime") {
      validateTime(schedule.starTime, event.target.value) && setSchedule({...schedule, [event.target.name]: event.target.value})
    } else {
      setSchedule({...schedule, [event.target.name]: event.target.value})
    }
  }

  useEffect(() => {
    handleSetSchedule(schedule, index);
  }, [schedule]);

  return (
    <div className='addSubject-Schedule__inputs'>
      <select
        name='day'
        className='Schedule__day-input'
        value={schedule.day}
        onChange={(event) => handleTime(event)}
        disabled={disable}
        required
      >
        <option>Lunes</option>
        <option>Martes</option>
        <option>Miércoles</option>
        <option>Jueves</option>
        <option>Viernes</option>
        <option>Sábado</option>
        <option>Domingo</option>
      </select>
      <div className='addSubject-Schedule__input-time'>
        <input name="starTime" type='time' disabled={disable} className='Schedule__input-time' value={schedule.starTime} onChange={(event) => handleTime(event)}/>
        <p>-</p>
        <input name="endTime" type='time' disabled={disable} className='Schedule__input-time' value={schedule.endTime} onChange={(event) => handleTime(event)}/>
      </div>
    </div>
  )
}

function validateTime(starTime, endTime) {
  starTime = new Date(`2023-05-24T${starTime}:00`);
  endTime = new Date(`2023-05-24T${endTime}:00`);
  
  return starTime < endTime
}