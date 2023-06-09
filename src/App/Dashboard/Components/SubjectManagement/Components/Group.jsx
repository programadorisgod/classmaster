import { HandleGroup } from "./HandleGroup";

export function Group({ user, subject, group, handlePassGroups, getGroups }) {
  return (
    <div className="subject" onClick={() => {handlePassGroups(true, <HandleGroup user={user} subject={subject} group={group} handlePassGroups={handlePassGroups} getGroups={getGroups} />)}}>
      <div className="subject-items">
        <h3 className="subject-label">{`Grupo: ${group.name}`}</h3>
      </div>
    </div>
  );
}