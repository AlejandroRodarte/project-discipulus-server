const names = {

    role: {
        collectionName: 'roles',
        modelName: 'Role'
    },

    user: {
        collectionName: 'users',
        modelName: 'User'
    },

    sharedFile: {
        collectionName: 'sharedFiles',
        modelName: 'SharedFile'
    },

    userRole: {
        collectionName: 'userRoles',
        modelName: 'UserRole'
    },

    sharedParentStudent: {
        collectionName: 'sharedParentStudents',
        modelName: 'SharedParentStudent'
    },

    parentStudent: {
        collectionName: 'parentStudents',
        modelName: 'ParentStudent'
    },

    parentStudentInvitation: {
        collectionName: 'parentStudentInvitations',
        modelName: 'ParentStudentInvitation'
    },

    sharedUserFile: {
        collectionName: 'sharedUserFiles',
        modelName: 'SharedUserFile'
    },

    userFile: {
        collectionName: 'userFiles',
        modelName: 'UserFile'
    },

    studentFile: {
        collectionName: 'studentFiles',
        modelName: 'StudentFile'
    },

    parentFile: {
        collectionName: 'parentFiles',
        modelName: 'ParentFile'
    },

    teacherFile: {
        collectionName: 'teacherFiles',
        modelName: 'TeacherFile'
    },

    sharedTimeRange: {
        collectionName: 'sharedTimeRanges',
        modelName: 'SharedTimeRange'
    },

    userEvent: {
        collectionName: 'userEvents',
        modelName: 'UserEvent'
    },

    class: {
        collectionName: 'classes',
        modelName: 'Class'
    },

    classStudent: {
        collectionName: 'classStudents',
        modelName: 'ClassStudent'
    },

    classStudentInvitation: {
        collectionName: 'classStudentInvitations',
        modelName: 'ClassStudentInvitation'
    },

    classUnknownStudentInvitation: {
        collectionName: 'classUnknownStudentInvitations',
        modelName: 'ClassUnknownStudentInvitation'
    },
    
    classFile: {
        collectionName: 'classFiles',
        modelName: 'ClassFile'
    },

    classStudentFile: {
        collectionName: 'classStudentFiles',
        modelName: 'ClassStudentFile'
    },

    sharedNote: {
        collectionName: 'sharedNotes',
        modelName: 'SharedNote'
    },

    sharedUserNote: {
        collectionName: 'sharedUserNotes',
        modelName: 'SharedUserNote'
    },

    userNote: {
        collectionName: 'userNotes',
        modelName: 'UserNote'
    },

    parentNote: {
        collectionName: 'parentNotes',
        modelName: 'ParentNote'
    },

    teacherNote: {
        collectionName: 'teacherNotes',
        modelName: 'TeacherNote'
    },

    studentNote: {
        collectionName: 'studentNotes',
        modelName: 'StudentNote'
    },

    classNote: {
        collectionName: 'classNotes',
        modelName: 'ClassNote'
    },

    classStudentNote: {
        collectionName: 'classStudentNotes',
        modelName: 'ClassStudentNote'
    },

    session: {
        collectionName: 'sessions',
        modelName: 'Session'
    },

    sessionFile: {
        collectionName: 'sessionFiles',
        modelName: 'SessionFile'
    },

    sessionNote: {
        collectionName: 'sessionNotes',
        modelName: 'SessionNote'
    },

    sessionStudent: {
        collectionName: 'sessionStudents',
        modelName: 'SessionStudent'
    },

    sessionStudentFile: {
        collectionName: 'sessionStudentFiles',
        modelName: 'SessionStudentFile'
    },

    sessionStudentNote: {
        collectionName: 'sessionStudentNotes',
        modelName: 'SessionStudentNote'
    },

    homework: {
        collectionName: 'homeworks',
        modelName: 'Homework'
    },

    homeworkFile: {
        collectionName: 'homeworkFiles',
        modelName: 'HomeworkFile'
    },

    homeworkNote: {
        collectionName: 'homeworkNotes',
        modelName: 'HomeworkNote'
    },

    homeworkSection: {
        collectionName: 'homeworkSections',
        modelName: 'HomeworkSection'
    },

    homeworkStudent: {
        collectionName: 'homeworkStudents',
        modelName: 'HomeworkStudent'
    },

    homeworkStudentFile: {
        collectionName: 'homeworkStudentFiles',
        modelName: 'HomeworkStudentFile'
    },

    homeworkStudentNote: {
        collectionName: 'homeworkStudentNotes',
        modelName: 'HomeworkStudentNote'
    },

    homeworkStudentSection: {
        collectionName: 'homeworkStudentSections',
        modelName: 'HomeworkStudentSection'
    },

    team: {
        collectionName: 'teams',
        modelName: 'Team'
    },

    teamStudent: {
        collectionName: 'teamStudents',
        modelName: 'TeamStudent'
    },

    project: {
        collectionName: 'projects',
        modelName: 'Project'
    },

    projectFile: {
        collectionName: 'projectFiles',
        modelName: 'ProjectFile'
    },

    projectNote: {
        collectionName: 'projectNotes',
        modelName: 'ProjectNote'
    },

    projectSection: {
        collectionName: 'projectSections',
        modelName: 'ProjectSection'
    },

    projectTeam: {
        collectionName: 'projectTeams',
        modelName: 'ProjectTeam'
    },

    projectTeamFile: {
        collectionName: 'projectTeamFiles',
        modelName: 'ProjectTeamFile'
    },

    projectTeamNote: {
        collectionName: 'projectTeamNotes',
        modelName: 'ProjectTeamNote'
    },

    projectTeamSection: {
        collectionName: 'projectTeamSections',
        modelName: 'ProjectTeamSection'
    },

    exam: {
        collectionName: 'exams',
        modelName: 'Exam'
    },

    examFile: {
        collectionName: 'examFiles',
        modelName: 'ExamFile'
    },

    examNote: {
        collectionName: 'examNotes',
        modelName: 'ExamNote'
    },

    examStudent: {
        collectionName: 'examStudents',
        modelName: 'ExamStudent'
    },

    examStudentFile: {
        collectionName: 'examStudentFiles',
        modelName: 'ExamStudentFile'
    },

    examStudentNote: {
        collectionName: 'examStudentNotes',
        modelName: 'ExamStudentNote'
    },

    examQuestion: {
        collectionName: 'examQuestions',
        modelName: 'ExamQuestion'
    },

    examStudentQuestion: {
        collectionName: 'examStudentQuestions',
        modelName: 'ExamStudentQuestion'
    },

    sharedClassGrade: {
        collectionName: 'sharedClassGrades',
        modelName: 'SharedClassGrade'
    },

    sharedOptionalEndTimeRange: {
        collectionName: 'sharedOptionalEndTimeRanges',
        modelName: 'SharedOptionalEndTimeRange'
    }

};

module.exports = names;
