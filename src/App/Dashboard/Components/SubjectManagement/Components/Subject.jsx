import { Groups } from "./Groups";

export function Subject({ user, subject, handlePassSubjects, getSubjects }) {
  return (
    <div className="subject" onClick={() => {handlePassSubjects(true, <Groups user={user} code={subject.code} subject={subject} handlePassSubjects={handlePassSubjects} getSubjects={getSubjects} />)}}>
      <div className="subject-items">
        <h3 className="subject-label">{subject.name}</h3>
        <p className="subject-label">{`Codigo: ${subject.code}`}</p>
        <p className="subject-label">{`n.º de grupos: ${subject.groups.length}`}</p>
      </div>
    </div>
  );
}
