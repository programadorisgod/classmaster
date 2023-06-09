import React, { useState, useEffect } from "react";

export function Notes({ student, data, onUpdateNote, onUpdateDefinitiva }) {
    const [note0, setNote0] = useState("");
    const [note1, setNote1] = useState("");
    const [note2, setNote2] = useState("");

    const [definitiva, setCalculo] = useState("");

    useEffect(() => {
        if (student) {
            setNote0(student[0] || "");
            setNote1(student[1] || "");
            setNote2(student[2] || "");
        }
    }, [student]);

    useEffect(() => {
        if (note0 !== "") {
            let calculo = note0 * 0.3 + note1 * 0.3 + note2 * 0.4;
            setCalculo(calculo);
            onUpdateDefinitiva(calculo);
        }
    }, [note0, note1, note2]);

    const handleNoteChange = (index, value) => {
        if (value >= 0 && value <= 5) {
            switch (index) {
                case 0:
                    setNote0(value);
                    onUpdateNote(0, value);
                    break;
                case 1:
                    setNote1(value);
                    onUpdateNote(1, value);
                    break;
                case 2:
                    setNote2(value);
                    onUpdateNote(2, value);
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <>
            <input
                type="number"
                className="input-asistencia"
                value={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? note0
                        : ""
                }
                placeholder="30%"
                onChange={(e) => handleNoteChange(0, e.target.value)}
                disabled={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? false
                        : true
                }
                min="0"
                max="5"
            />{" "}
            <input
                type="number"
                className="input-asistencia"
                placeholder="30%"
                value={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? note1
                        : ""
                }
                onChange={(e) => handleNoteChange(1, e.target.value)}
                disabled={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? false
                        : true
                }
                min="0"
                max="5"
            />{" "}
            <input
                type="number"
                className="input-asistencia"
                placeholder="40%"
                value={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? note2
                        : ""
                }
                onChange={(e) => handleNoteChange(2, e.target.value)}
                disabled={
                    data.subject !== undefined &&
                        data.subject !== "" &&
                        data.group !== undefined &&
                        data.group !== ""
                        ? false
                        : true
                }
                min="0"
                max="5"
            />{" "}
            <input
                type="number"
                className="input-asistencia"
                placeholder="Def."
                value={definitiva}
                disabled={true}
                min="0"
                max="5"
            />
        </>
    );
}
