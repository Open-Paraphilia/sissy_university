function startApp() {
    //Load navbar
    //loadNavbar();

    //Initialize data
    if (localStorage.getItem("majorsData") == null) {
        initializeMajorsData();
    }
    if (localStorage.getItem("classesData") == null) {
        initializeClassesData();
    }
    if (localStorage.getItem("clubsData") == null) {
        initializeClubsData();
    }
    if (localStorage.getItem("punishmentsData") == null) {
        initializePunishmentsData();
    }


    //Set major, classes, jobs, punishments, club activities
    if (localStorage.getItem("currentClasses") == null) {
        localStorage.setItem("currentClasses", JSON.stringify([]));
    }
    if (localStorage.getItem("todayClasses") == null) {
        localStorage.setItem("todayClasses", JSON.stringify([]));
    }
    if (localStorage.getItem("currentPunishments") == null) {
        localStorage.setItem("currentPunishments", JSON.stringify([]));
    }
    if (localStorage.getItem("currentClubs") == null) {
        localStorage.setItem("currentClubs", JSON.stringify([]));
    }
    if (localStorage.getItem("currentPerkUses") == null) {
        localStorage.setItem("currentPerkUses", "0");
    }
    if (localStorage.getItem("completedClasses") == null) {
        localStorage.setItem("completedClasses", JSON.stringify([]));
    }
    if (localStorage.getItem("attendedClasses") == null) {
        localStorage.setItem("attendedClasses", JSON.stringify([]));
    }
    if (localStorage.getItem("attendedClassesToday") == null) {
        localStorage.setItem("attendedClassesToday", JSON.stringify([]));
    }
    if (localStorage.getItem("completedClubActivities") == null) {
        localStorage.setItem("completedClubActivities", JSON.stringify([]));
    }
    if (localStorage.getItem("perksUsedToday") == null) {
        localStorage.setItem("perksUsedToday", "0");
    }
    if (localStorage.getItem("completedMajors") == null) {
        localStorage.setItem("completedMajors", JSON.stringify([]));
    }
    if (localStorage.getItem("completedMajors") == null) {
        localStorage.setItem("completedMajors", JSON.stringify([]));
    }

    //Set max counters
    if (localStorage.getItem("maxClasses") == null) {
        localStorage.setItem("maxClasses", "4");
    }
    if (localStorage.getItem("maxPunishments") == null) {
        localStorage.setItem("maxPunishments", "5");
    }
    if (localStorage.getItem("maxClubs") == null) {
        localStorage.setItem("maxClubs", "1");
    }
    if (localStorage.getItem("advancedClassesRequired") == null) {
        localStorage.setItem("advancedClassesRequired", "3")
    }
    if (localStorage.getItem("maxPerkUses") == null) {
        localStorage.setItem("maxPerkUses", "3");
    }

    //Set statistics counter
    if (localStorage.getItem("punishmentsDoneNum") == null) {
        localStorage.setItem("punishmentsDoneNum", "0");
    }
    if (localStorage.getItem("clubActivitiesDoneNum") == null) {
        localStorage.setItem("clubActivitiesDoneNum", "0");
    }

    //Set schedule day checker
    if (localStorage.getItem("lastDate") == null) {
        localStorage.setItem("lastDate", JSON.stringify(getTodayStart()));
    }

    //Set graduation mechanics
    if (localStorage.getItem("graduating") == null) {
        localStorage.setItem("graduating", "false");
    }
    if (localStorage.getItem("finalThesisInProgress") == null) {
        localStorage.setItem("finalThesisInProgress", "false")
    }
    if (localStorage.getItem("finalThesisOption") == null) {
        localStorage.setItem("finalThesisOption", "0")
    }


    //LOAD THE NAVBAR
    $("#loadNavbar").load("navbar.html");

    //LOAD footer
    $("footer").append($('<div class="footer" style="height: 200px"></div>'));

    //Redirect if final thesis is in progress
    if (localStorage.getItem("finalThesisInProgress") == "true") {
        let currentHtmlFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if (currentHtmlFile == "settings.html" || currentHtmlFile == "rules.html") {
            return false;
        }

        else if (currentHtmlFile != "thesis_final.html") {
            let finalThesisOption = localStorage.getItem("finalThesisOption");
            window.location = "thesis_final.html?thesisId=" + finalThesisOption;
        }

    }

    //Run timer
    hasOneDayPassed();
}

/*
**********************
MAJORS
**********************
*/

function viewMajorsPage() {
    let majorsData = getMajorsData();
    let completedMajors = getCompletedMajors();

    let majorsContainer = $('.card-container');
    let row = $('<div class="row">');


    for (let thisMajor of majorsData) {
        let col = $('<div class="col-auto">');
        let card = $('<div class="card" style="width:18rem; height: 400px">');

        let imgUrl = "img/" + "major" + thisMajor.id + ".jpg";
        card
            .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
            window.location.href = "major.html?majorId=" + thisMajor.id;
        })
            .append($('<h5 class="card-title">').text(thisMajor.name));
        if (arrayIncludesObjectWithId(completedMajors, thisMajor) === true) {
            card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
        }

        $(row).append(col.append(card));
    }
    majorsContainer.append(row);
}

function signMajor(majorObject) {
    if (getCurrentMajor() == null) {
        localStorage.setItem("currentMajor", JSON.stringify(majorObject));
        alert("You have have successfully signed up for " + majorObject.name + "!");
        return;
    }
    alert("You have already signed up for a major.")
}

function viewMajor() {
    //get major info
    let majorId = window.location.href.split("=")[1];
    let thisMajor = getMajorsData().find(m => m.id == majorId);


    //get prerequisites and build prerequisites html
    let classesData = getClassesData();
    let prereqsIds = thisMajor.prerequisites.split(' ').filter((val) => val);
    let prereqsArr = [];
    let prereqsLinks = [];
    if (prereqsIds.length > 0) {
        for (let prereqId of prereqsIds) {
            let prereqObject = classesData.find(c => c.id == prereqId);
            prereqsArr.push(prereqObject);

            let prereqLink =
                '<a href="class.html?classId=' + prereqId + '">' + prereqObject.name + ' </a>';
            prereqsLinks.push(prereqLink)

        }
    }

    let prereqsHtml = $('<h5>').text("Prerequisites: ");
    if (prereqsIds.length > 0) {
        for (let prereqLink of prereqsLinks) {
            prereqsHtml.append(prereqLink);
        }
    }
    else {
        prereqsHtml.text("Prerequisites: None")
    }


    //Get container for the object
    let container = $('.container');

    //Create object
    let objectInfo = $('<div class="object-info">');

    let mainInfoRow = $('<div class="row">');
    let col = $('<div class="col">');

    //Append image, title and description to object info
    let imgUrl = "img/major" + thisMajor.id + ".jpg";
    col.append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl));
    col.append($('<h1>').text(thisMajor.name)
        .append(prereqsHtml));

    col.append($('<p>').text(thisMajor.description));
    objectInfo.append(mainInfoRow.append(col));

    //Append Thesis to object
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h3>').text("Final Thesis:"))
                ));
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h4 class="text-center">').text("Option 1:"))
                    .append($('<p class="text-center">').text(thisMajor.pass1))
                    .append($('<h4>').text("Option 2:"))
                    .append($('<p class="text-center">').text(thisMajor.pass2))
                    .append($('<h4>').text("Option 3:"))
                    .append($('<p class="text-center">').text(thisMajor.pass3))
                ));

    //Append buttons to object
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-success">Sign Up</a>').click(signMajor.bind(this, thisMajor)))
                ));

    //Appent object info to container
    container.append(objectInfo);
}

function graduateMajor() {
    //check current major
    let currentMajor = getCurrentMajor();
    if (currentMajor === null) {
        alert("You haven't signed up for a major");
        return;
    }

    //check current punishments
    let currentPunishments = getCurrentPunishments();
    let punishmentsPendingNum = currentPunishments.length;
    if (punishmentsPendingNum > 0) {
        alert("You cannot graduate with pending punishments")
        return;
    }

    //check for active classes
    let currentClasses = getCurrentClasses();
    if (currentClasses.length > 0) {
        alert("You cannot graduate with currently active classes.")
        return;
    }

    //check for minimum number of class types
    let completedClasses = getCompletedClasses();
    let completedCoreClasses = 0;
    let completedBaseClasses = 0;
    let completedAdvancedClasses = 0;
    let completedMasterClasses = 0;

    for (let _class of completedClasses) {
        if (_class.tier == "core") completedCoreClasses++;
        else if (_class.tier == "base") completedBaseClasses++;
        else if (_class.tier == "advanced") completedAdvancedClasses++;
        else if (_class.tier == "master") completedMasterClasses++;
    }

    let advancedClassesRequired = localStorage.getItem("advancedClassesRequired");

    if (completedCoreClasses < 5) {
        alert("You need to complete at least 5 core classes");
        return;
    }
    if (completedBaseClasses < 4) {
        alert("You need to complete at least 4 core classes");
        return;
    }
    if (completedAdvancedClasses < advancedClassesRequired) {
        alert("You need to complete at least " + advancedClassesRequired + " advanced classes");
        return;
    }
    if (completedBaseClasses < 2) {
        alert("You need to complete at least 2 master classes");
        return;
    }

    //check for major prerequisites
    let classesData = getClassesData();
    let pendingPrereqs = false;
    let prereqsIds = currentMajor.prerequisites.split(' ').filter((val) => val);
    for (let prereqId of prereqsIds) {
        let prereqClass = classesData.find(c => c.id == prereqId);

        let completedClassesHasPrereqClass = arrayIncludesObjectWithId(completedClasses, prereqClass);
        if (completedClassesHasPrereqClass === false) {
            alert("You need to complete " + prereqClass.name + " first!");
            pendingPrereqs = true;
        }
    }
    if (pendingPrereqs === true) {
        return;
    }

    alert("You may attempt to graduate");
    window.location = "major_final.html";
    return false;
}

function chooseFinalThesis() {
    localStorage.setItem("graduating", "true");

    let thisMajor = getCurrentMajor();

    let container = $('.container');

    //Create object
    let objectInfo = $('<div class="object-info">');

    let mainInfoRow = $('<div class="row">');
    let col = $('<div class="col">');

    //Append image, title and description to object info
    let imgUrl = "img/" + "major" + thisMajor.id + ".jpg";

    col.append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl));
    col.append($('<h1>').text(thisMajor.name));
    col.append($('<p>').text(thisMajor.description));
    objectInfo.append(mainInfoRow.append(col));


    //Append Thesis to object
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h3>').text("Final Thesis:"))
                ));
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h4 class="text-center">').text("Option 1:"))
                    .append($('<p class="text-center">').text(thisMajor.pass1))
                    .append($('<a href="" class="btn btn-success">Select Option 1</a>').click(function () {
                        window.location.href = "thesis_final.html?thesisId=" + 1;
                        return false;
                    }))
                    .append($('<h4>').text("Option 2:"))
                    .append($('<p class="text-center">').text(thisMajor.pass2))
                    .append($('<a href="" class="btn btn-success">Select Option 2</a>').click(function () {
                        window.location.href = "thesis_final.html?thesisId=" + 2;
                        return false;
                    }))
                    .append($('<h4>').text("Option 3:"))
                    .append($('<p class="text-center">').text(thisMajor.pass3))
                    .append($('<a href="" class="btn btn-success">Select Option 3</a>').click(function () {
                        window.location.href = "thesis_final.html?thesisId=" + 3;
                        return false;
                    }))
                ));

    //Append object info to container
    container.append(objectInfo);

}

function finalThesisProgress() {
    if (localStorage.getItem("graduating") == "false") {
        window.location.href = "progress.html";
        return;
    }
    let url = window.location.href.split("=")[1];
    let numberPattern = /\d+/g;

    let thesisOption = url.match(numberPattern).toString();

    //set major graduation in progress
    localStorage.setItem("finalThesisInProgress", "true");
    localStorage.setItem("finalThesisOption", thesisOption);

    let thisMajor = getCurrentMajor();

    let container = $('.container');

    //Create object
    let objectInfo = $('<div class="object-info">');

    let mainInfoRow = $('<div class="row">');
    let col = $('<div class="col">');

    //Append image, title and description to object info
    let imgUrl = "img/major" + thisMajor.id + ".jpg";
    col.append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl));
    col.append($('<h1>').text(thisMajor.name));
    col.append($('<p>').text(thisMajor.description));
    objectInfo.append(mainInfoRow.append(col));

    //Append Thesis to object
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h3>').text("Final Thesis:"))
                ));
    if (thesisOption == 1) {
        objectInfo
            .append(
                $('<div class="row">')
                    .append($('<div class="col">')
                        .append($('<h4 class="text-center">').text("Thesis"))
                        .append($('<p class="text-center">').text(thisMajor.pass1))
                    ));
    }
    else if (thesisOption == 2) {
        objectInfo
            .append(
                $('<div class="row">')
                    .append($('<div class="col">')
                        .append($('<h4 class="text-center">').text("Thesis"))
                        .append($('<p class="text-center">').text(thisMajor.pass2))
                    ));
    }
    else if (thesisOption == 3) {
        objectInfo
            .append(
                $('<div class="row">')
                    .append($('<div class="col">')
                        .append($('<h4 class="text-center">').text("Thesis"))
                        .append($('<p class="text-center">').text(thisMajor.pass3))
                    ));
    }
    //Append buttons to object
    objectInfo
        .append(
            $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-success">Complete thesis</a>').click(completeFinalThesis.bind(this, thisMajor)))
                )
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-danger">Roll punishment</a>').click(rollPunishment.bind(this, null)))
                )
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-warning">Fail thesis</a>').click(failFinalThesis.bind(this, thisMajor)))
                )
        );

    //Appent object info to container
    container.append(objectInfo);

    //Get punishments
    container.append($('<h1>').text("Punishments:"));
    let currentPunishments = getCurrentPunishments();

    for (let thisPunishment of currentPunishments) {
        let punishmentImg = "img/punishment" + thisPunishment.id + ".jpg";
        container.append($('<div class="row" style="margin-bottom: 24px">')
            .append($('<div class="col">')
                .append($('<img class="img-fluid" style="max-height: 300px">').attr('src', punishmentImg)))
            .append($('<div class="col">')
                .append($('<h3>').text(thisPunishment.name))
                .append($('<p>').text(thisPunishment.description))
                .append($('<a href="" class="btn btn-success">Complete!</a>').click(completePunishment.bind(this, thisPunishment))
                )
            )
        )
    }
}

function failFinalThesis() {
    alert("You have failed your final thesis. You may retry. Rolling max punishments");

    localStorage.setItem("graduating", "false");
    localStorage.setItem("finalThesisOption", "0");
    localStorage.setItem("finalThesisInProgress", "false");

    console.log(localStorage.getItem("finalThesisOption"));
    console.log(localStorage.getItem("finalThesisInProgress"));

    let maxPunishments = getMaxPunishments();
    for (let i = 0; i < maxPunishments; i++) {
        rollPunishment();
    }
}

function completeFinalThesis() {
    if (getCurrentPunishments().length > 0) {
        alert("Complete your punishments first!");
        return;
    }

    localStorage.setItem("graduating", "false");
    localStorage.setItem("finalThesisInProgress", "false");
    localStorage.setItem("finalThesisOption", "0");

    if (localStorage.getItem("completedMajors") == null) {
        localStorage.setItem("completedMajors", JSON.stringify([]));
    }

    alert("Final thesis completed!");
    window.location = "congratulations.html";
    return false;
}

function getCurrentMajor() {
    return JSON.parse(localStorage.getItem("currentMajor"));
}

function getCompletedMajors() {
    return JSON.parse(localStorage.getItem("completedMajors"));

}

function congratulations() {
    let currentMajor = getCurrentMajor();
    let completedMajors = getCompletedMajors();

    alert("CONGRATULATIONS!");

    let container = $('.container');
    let text = "Congratulations, you have managed to graduate from the Sissy University. " +
        currentMajor.name +
        " has been added to your list of completed majors. You can sign up for another major or replay the same one again." +
        " You have completed " + getCompletedClasses().length + " classes and endured " + getPunishmentsDoneNum() + " punishments in total." +
        " I hope that you have enjoyed the game, please share your feedback I would really appreciate it";


    container.append($('<h4>').text(text));

    container.append('<a href="majors.html" class="btn btn-success">Continue</a>').click(function () {
        completedMajors.push(currentMajor);
        localStorage.clear();
        localStorage.setItem("completedMajors", JSON.stringify(completedMajors));
    });
}

/*
**********************
CLASSES
**********************
*/
function viewClassesPage() {
    let classesData = getClassesData();
    let completedClasses = getCompletedClasses();

    let classesContainer = $('.card-container');


    let coreClassesRow = $('<div class="row coreClasses-container">');
    let baseClassesRow = $('<div class="row baseClasses-container">');
    let advancedClassesRow = $('<div class="row advancedClasses-container">');
    let masterClassesRow = $('<div class="row masterClasses-container">');
    let otherClassesRow = $('<div class="row masterClasses-container">');

    for (let thisClass of classesData) {
        let col = $('<div class="col-auto">');

        let imgUrl = "img/" + "class" + thisClass.id + ".jpg";

        if (thisClass.tier === "core") {
            let card = $('<div class="card border-danger" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h4 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));
            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            $(coreClassesRow).append(col.append(card));
        }
        else if (thisClass.tier === "base") {
            let card = $('<div class="card border-warning" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h5 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));
            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            $(baseClassesRow).append(col.append(card));
        }
        else if (thisClass.tier === "advanced") {
            let card = $('<div class="card border-success" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h5 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));
            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            $(advancedClassesRow).append(col.append(card));
        }
        else if (thisClass.tier === "master") {
            let card = $('<div class="card border-primary" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h5 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));
            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            $(masterClassesRow).append(col.append(card));
        }
        else {
            let card = $('<div class="card border-secondary" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h5 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));
            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            $(otherClassesRow).append(col.append(card));
        }

    }
    classesContainer.append($('<h3 class="bg-danger">').text("Core classes:"));
    classesContainer.append(coreClassesRow);
    classesContainer.append($('<h3 class="bg-warning">').text("Base classes:"));
    classesContainer.append(baseClassesRow);
    classesContainer.append($('<h3 class="bg-success">').text("Advanced classes:"));
    classesContainer.append(advancedClassesRow);
    classesContainer.append($('<h3 class="bg-primary">').text("Master classes:"));
    classesContainer.append(masterClassesRow);
    classesContainer.append(otherClassesRow);

}

function viewClass() {
    let classesData = getClassesData();

    let classId = window.location.href.split("=")[1];
    let thisClass = classesData.find(c => c.id == classId);

    let classDays = thisClass.days.split(' ').filter((val) => val);
    let daysNames = getWeekdays();

    let daysString = [];
    classDays.forEach(function (classDay) {
        daysString.push(daysNames[classDay]);
    });
    daysString = daysString.join(', ');

    //Get container for the object
    let container = $('.container');

    //Create object
    let objectInfo = $('<div class="object-info">');


    //Get prerequisites data
    let prereqsIds = thisClass.prerequisites.split(' ').filter((val) => val);
    let prereqsLinks = [];
    if (prereqsIds.length > 0) {
        for (let prereqId of prereqsIds) {
            let prereqObject = classesData.find(c => c.id == prereqId);

            let prereqLink =
                '<a href="class.html?classId=' + prereqId + '">' + prereqObject.name + ' </a>';
            prereqsLinks.push(prereqLink)

        }
    }
    //Build prerequisities html
    let prereqsHtml = $('<h5>').text("Prerequisites: ");
    if (prereqsIds.length > 0) {
        for (let prereqLink of prereqsLinks) {
            prereqsHtml.append(prereqLink);
        }
    }
    else {
        prereqsHtml.text("Prerequisites: None")
    }

    let imgUrl = "img/class" + thisClass.id + ".jpg";
    //Append Image title description
    objectInfo
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl))
            ))
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<h2>').text(thisClass.name))
                .append($('<h4>')
                    .append(prereqsHtml))
                .append($('<p>').text(thisClass.description))
            ));


    //Append Daily tasks and pass requirments
    objectInfo.append($('<div class="row">')
        .append($('<div class="col">')
            .append($('<h6>').text("Daily tasks: " + daysString))
            .append($('<p>').append($('<b>').text("Option 1: ")).append($('<span>').text(thisClass.opt1)))
            .append($('<p>').append($('<b>').text("Option 2: ")).append($('<span>').text(thisClass.opt2)))
        )
        .append($('<div class="col">')
            .append($('<h6>').text("Exam:"))
            .append($('<p>').append($('<b>').text("Option 1: ")).append($('<span>').text(thisClass.pass1)))
            .append($('<p>').append($('<b>').text("Option 2: ")).append($('<span>').text(thisClass.pass2)))
        )
    );

    //Append buttons
    let buttonsRow = $('<div class="row">')
        .append($('<div class="col">')
            .append($('<a href="" class="btn btn-success">Sign Up</a>').click(signClass.bind(this, thisClass)
            ))
        );

    //Append to page
    objectInfo.append(buttonsRow);
    container.append(objectInfo);
}

function signClass(thisClass) {
    let classesData = getClassesData();
    let currentClasses = getCurrentClasses();
    let completedClasses = getCompletedClasses();

    let maxClasses = localStorage.getItem("maxClasses");

    //Check if you are signed up for a major
    if (getCurrentMajor() == null) {
        alert("Sign up for a major first");
        return
    }
    //Check if you are signed up for the class already
    for (let _class of currentClasses) {
        if (_class.id == thisClass.id) {
            alert("You have already signed up for " + thisClass.name);
            return;
        }
    }

    if (currentClasses.length >= maxClasses) {
        alert("You can't sign up for more than " + maxClasses + " classes");
        return;
    }

    //Check if you have completed this class before
    for (let _class of completedClasses) {
        if (_class.id == thisClass.id) {
            alert("You have completed this class previously");
            return;
        }
    }


    let pendingPrereqs = false;
    let prereqsIds = thisClass.prerequisites.split(' ').filter((val) => val);
    for (let prereqId of prereqsIds) {
        let prereqClass = classesData.find(c => c.id == prereqId);

        let completedClassesHasPrereqClass = arrayIncludesObjectWithId(completedClasses, prereqClass);
        if (completedClassesHasPrereqClass === false) {
            alert("You need to complete " + prereqClass.name + " first!");
            pendingPrereqs = true;
        }
    }
    if (pendingPrereqs === true) {
        return;
    }

    currentClasses.push(thisClass);
    localStorage.setItem("currentClasses", JSON.stringify(currentClasses));
    alert("You have successfully signed up for this class.")

}

function attendClass(thisClass) {
    let todayClasses = getTodayClasses();
    let attendedClassesToday = getAttendedClassesToday();
    let attendedClasses = getAttendedClasses();

    //remove class from today classes
    let thisClassIndex = todayClasses.findIndex(obj => obj.id == thisClass.id);
    todayClasses.splice(thisClassIndex, 1);

    //add class to today's attended classes
    attendedClassesToday.push(thisClass);

    //add class to attended class
    if (arrayIncludesObjectWithId(attendedClasses, thisClass) === false) {
        attendedClasses.push(thisClass);
    }

    localStorage.setItem("attendedClassesToday", JSON.stringify(attendedClassesToday));
    localStorage.setItem("attendedClasses", JSON.stringify(attendedClasses));
    localStorage.setItem("todayClasses", JSON.stringify(todayClasses));

    alert("Class attended");
    location.reload();
}

function passClass(thisClass) {
    let currentPunishments = getCurrentPunishments();
    let currentClasses = getCurrentClasses();
    let todayClasses = getTodayClasses();
    let completedClasses = getCompletedClasses();
    let attendedClasses = getAttendedClasses();

    if (arrayIncludesObjectWithId(attendedClasses, thisClass) === false) {
        alert("You need to attend this class at least once before trying to pass it!");
        return;
    }
    if (currentPunishments.length > 0) {
        alert("Do your punishments first!");
        return;
    }

    let currentClassesIndexOfClass = currentClasses.findIndex(x => x.id == thisClass.id);
    let todayClassesIndexOfClass = todayClasses.findIndex(x => x.id == thisClass.id);

    currentClasses.splice(currentClassesIndexOfClass, 1);
    todayClasses.splice(todayClassesIndexOfClass, 1);
    completedClasses.push(thisClass);

    localStorage.setItem("currentClasses", JSON.stringify(currentClasses));
    localStorage.setItem("todayClasses", JSON.stringify(todayClasses));
    localStorage.setItem("completedClasses", JSON.stringify(completedClasses));

    alert("Class passed!");
    location.reload()
}

function skipClass(thisClass) {
    let todayClasses = getTodayClasses();
    let attendedClassesToday = getAttendedClassesToday();

    //remove class from today classes
    let thisClassIndex = todayClasses.findIndex(obj => obj.id == thisClass.id);
    todayClasses.splice(thisClassIndex, 1);

    //add class to today's attended classes
    attendedClassesToday.push(thisClass);

    localStorage.setItem("attendedClassesToday", JSON.stringify(attendedClassesToday));
    localStorage.setItem("todayClasses", JSON.stringify(todayClasses));

    rollPunishment(thisClass)
}

function getCurrentClasses() {
    return JSON.parse(localStorage.getItem("currentClasses"));
}

function getCompletedClasses() {
    return JSON.parse(localStorage.getItem("completedClasses"))
}

function getAttendedClasses() {
    return JSON.parse(localStorage.getItem("attendedClasses"))
}

function getAttendedClassesToday() {
    return JSON.parse(localStorage.getItem("attendedClassesToday"));
}

function setTodayClasses() {
    let currentClasses = getCurrentClasses();
    let currentClassesSorted = currentClasses.sort((a, b) => a.id > b.id);

    let todayClasses = getTodayClasses();
    let attendedClassesToday = getAttendedClassesToday();

    let todayNum = getTodayNum();


    for (let thisClass of currentClassesSorted) {
        let classDays = thisClass.days.split(' ').filter((val) => val);

        let classHasActivitiesToday = classDays.includes(todayNum);
        let classHasBeenAttendedToday = arrayIncludesObjectWithId(attendedClassesToday, thisClass);
        let classAlreadyInTodayClasses = arrayIncludesObjectWithId(todayClasses, thisClass);

        if (
            classHasActivitiesToday === true
            && classHasBeenAttendedToday === false
            && classAlreadyInTodayClasses === false) {
            console.log(thisClass);
            todayClasses.push(thisClass);
        }
    }
    localStorage.setItem("todayClasses", JSON.stringify(todayClasses));
}

function getTodayClasses() {
    return JSON.parse(localStorage.getItem("todayClasses"));
}

/*
**********************
PUNISHMENTS/DETENTIONS
**********************
*/
function rollPunishment(thisClass) {
    console.log(thisClass);
    if (localStorage.getItem("currentMajor") == null) {
        alert("Sign up for a major first!");
        return;
    }

    if (thisClass != null) {
        alert("You will be punished for failing " + thisClass.name + " today!");
    }

    let punishmentsData = getPunishmentsData();
    let currentPunishments = getCurrentPunishments();
    let maxPunishments = getMaxPunishments();

    let numberOfPunishments = punishmentsData.length;

    if (currentPunishments.length >= maxPunishments) {
        alert("You can't have more than " + maxPunishments + " punishments active");
        return;
    }

    //generate num 1-17
    let generatedPunishmentId = generateRandomNum(numberOfPunishments) + 1;

    //check last punishment, prevent duplicates
    while (true) {
        if (currentPunishments.find(p => p.id == generatedPunishmentId) != null) {
            console.log("this punishment is already active");
            generatedPunishmentId = generateRandomNum(numberOfPunishments) + 1;
        }
        else {
            let punishmentObj = punishmentsData.find(p => p.id == generatedPunishmentId);
            currentPunishments.push(punishmentObj);
            alert("You punishment is " + punishmentObj.name);
            break;
        }
    }

    localStorage.setItem("currentPunishments", JSON.stringify(currentPunishments));
}

function completePunishment(thisPunishment) {
    alert(thisPunishment.name + " completed");

    let currentPunishments = getCurrentPunishments();

    let thisPunishmentIndex = currentPunishments.findIndex(obj => obj.id == thisPunishment.id);

    currentPunishments.splice(thisPunishmentIndex, 1);
    localStorage.setItem("currentPunishments", JSON.stringify(currentPunishments));


    let punishmentsDoneNum = getPunishmentsDoneNum();
    punishmentsDoneNum++;
    localStorage.setItem("punishmentsDoneNum", punishmentsDoneNum);
}

function getCurrentPunishments() {
    return JSON.parse(localStorage.getItem("currentPunishments"));
}

function getMaxPunishments() {
    return localStorage.getItem("maxPunishments");
}

function getPunishmentsDoneNum() {
    return localStorage.getItem("punishmentsDoneNum")
}

function viewPunishmentsPage() {
    //Load punish button
    let container = $('#rollPunishment');
    container.append($('<a href="" class="btn btn-danger">Roll punishment</a>').click(rollPunishment.bind(this, null)));


    //Load punishments
    let punishments = getPunishmentsData();
    let cardContainer = $('.card-container');
    let row = $('<div class="row">');
    for (let thisPunishment of punishments) {
        let col = $('<div class="col-auto">');
        let card = $('<div class="card" style="width:18rem; height: 400px">');

        let imgUrl = "img/" + "punishment" + thisPunishment.id + ".jpg";
        card
            .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
            window.location.href = "punishment.html?punishmentId=" + thisPunishment.id;
        })
            .append($('<h5 class="card-title">').text(thisPunishment.name));

        $(row).append(col.append(card));
    }
    cardContainer.append(row)
}

function viewPunishment() {
    let punishmentsData = getPunishmentsData();

    let punishmentId = window.location.href.split("=")[1];
    let thisPunishment = punishmentsData.find(c => c.id == punishmentId);

    let container = $('.container');
    let objectInfo = $('<div class="object-info">');

    let imgUrl = "img/punishment" + thisPunishment.id + ".jpg";

    objectInfo
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl))
            ))
        .append($('<div class="row">')
            .append($('<div class="col text-center">')
                .append($('<h2>').text(thisPunishment.name))
                .append($('<h5>').text(thisPunishment.description))
            ))

    //Append to page
    container.append(objectInfo);
}

/*
**********************
CLUBS
**********************
*/
function viewClubsPage() {
    let clubsData = getClubsData();
    let container = $('.card-container');
    let row = $('<div class="row">');

    for (let thisClub of clubsData) {
        let col = $('<div class="col-auto">');
        let card = $('<div class="card" style="width:18rem; height: 400px">');

        let imgUrl = "img/" + "club" + thisClub.id + ".jpg";
        card
            .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
            window.location.href = "club.html?clubId=" + thisClub.id;
        })
            .append($('<h5 class="card-title">').text(thisClub.name));

        $(row).append(col.append(card));
    }
    container.append(row);
}

function viewClub() {
    let clubsData = getClubsData();

    let clubId = window.location.href.split("=")[1];
    let thisClub = clubsData.find(c => c.id == clubId);

    let container = $('.container');
    let objectInfo = $('<div class="object-info">');

    let imgUrl = "img/club" + thisClub.id + ".jpg";

    objectInfo
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<img class="img-fluid" style="max-width: 600px">').attr('src', imgUrl))
            ))
        .append($('<div class="row">')
            .append($('<div class="col text-center">')
                .append($('<h2>').text(thisClub.name))
                .append($('<p>').text(thisClub.description))
            ))
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<h6>').text("Perks:"))
                .append($('<p>').append($('<b>').text("Perk 1: ")).append($('<span>').text(thisClub.perk1)))
                .append($('<p>').append($('<b>').text("Perk 2: ")).append($('<span>').text(thisClub.perk2)))
            )
            .append($('<div class="col">')
                .append($('<h6>').text("Activities:"))
                .append($('<p>').append($('<b>').text("Activity 1: ")).append($('<span>').text(thisClub.job1)))
                .append($('<p>').append($('<b>').text("Activity 2: ")).append($('<span>').text(thisClub.job2)))
            ))
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append($('<a href="" class="btn btn-success">Sign Up</a>').click(signClub.bind(this, thisClub)
                )))
            .append($('<div class="col">')
                .append($('<a href="" class="btn btn-danger">Leave</a>').click(leaveClub.bind(this, thisClub)))
            ));

    //Append to page
    container.append(objectInfo);
}

function signClub(thisClub) {
    let currentClubs = getCurrentClubs();
    let maxClubs = getMaxClubs();

    if (getCurrentMajor() === null) {
        alert("Sign up for a major first!");
        return;
    }

    if (currentClubs.length >= maxClubs) {
        alert("You can't sign up for more than " + maxClubs + " clubs");
        return;
    }
    if (arrayIncludesObjectWithId(currentClubs, thisClub)) {
        alert("You have already signed up for this club");
        return
    }
    currentClubs.push(thisClub);
    localStorage.setItem("currentClubs", JSON.stringify(currentClubs));

    //Club 4 perks and jobs
    if (thisClub.id == 4) {
        localStorage.setItem("advancedClassesRequired", "4");
        localStorage.setItem("maxClasses", "5");
        localStorage.setItem("maxClubs", "2");
        localStorage.setItem("maxPunishments", "9");
        localStorage.setItem("currentPerkUses", "2");

        alert("Maximum enrolled classes increased to 5. Maximum punishments increased to 9. Maximum clubs increased to 2. Gained two perk uses.");
    }

    alert("You have signed up for the " + thisClub.name);
}

function completeClubActivity(activityNum) {
    let currentClubs = getCurrentClubs();
    let lastClub = currentClubs[currentClubs.length - 1];


    let completedClubActivities = getCompletedClubActivities();
    if (completedClubActivities.includes(activityNum)) {
        alert("You have already done this club activity today");
        return;
    }

    let perkUses = getCurrentPerkUses();

    if (lastClub.id == 1) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
    }
    else if (lastClub.id == 2) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
    }
    else if (lastClub.id == 3) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
            rollPunishment();
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
            rollPunishment();
        }
    }
    else if (lastClub.id == 5) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
    }
    else if (lastClub.id == 6) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
    }
    else if (lastClub.id == 7) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses += 1;

            let isolationPunishment = getPunishmentsData().find(x => x.id == 1);
            let currentPunishments = getCurrentPunishments();
            currentPunishments.push(isolationPunishment);

            localStorage.setItem("currentPunishments", currentPunishments);
            alert("Rolled Isolation punishment");
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skip.");
            perkUses += 2;
        }
    }
    else if (lastClub.id == 8) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
        }
    }
    else if (lastClub.id == 9) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
        }
    }
    else if (lastClub.id == 10) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 1 class skip.");
            perkUses++;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            rollPunishment();
            perkUses += 2;
        }
    }
    else if (lastClub.id == 11) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skips.");
            perkUses += 2;
        }
    }
    else if (lastClub.id == 12) {
        if (activityNum == 1) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". . Gained 2 class skip.");
            perkUses += 2;
        }
        else if (activityNum == 2) {
            alert("Completed " + lastClub.name + " Activity " + activityNum + ". Gained 2 class skip.");
            perkUses += 2;
        }
    }

    completedClubActivities.push(activityNum);

    localStorage.setItem("currentPerkUses", perkUses);
    localStorage.setItem("completedClubActivities", JSON.stringify(completedClubActivities));
}

function useClubPerk(thisClass) {
    let currentPerkUsesLeft = getCurrentPerkUses();
    currentPerkUsesLeft -= 1;

    if (currentPerkUsesLeft < 0) {
        alert("You don't have any perk uses left.");
        return;
    }

    let perksUsedToday = getPerksUsedToday();
    if (perksUsedToday >= getMaxPerkUses()) {
        alert("You can not use more than " + getMaxPerkUses() + " club perks per day.");
        return;
    }
    perksUsedToday++;

    alert("Club perk used to skip " + thisClass.name);
    localStorage.setItem("currentPerkUses", currentPerkUsesLeft);

    let todayClasses = getTodayClasses();
    let attendedClassesToday = getAttendedClassesToday();

    //remove class from today classes
    let thisClassIndex = todayClasses.findIndex(obj => obj.id == thisClass.id);
    todayClasses.splice(thisClassIndex, 1);

    //add class to today's attended classes
    attendedClassesToday.push(thisClass);

    localStorage.setItem("perksUsedToday", perksUsedToday);
    localStorage.setItem("attendedClassesToday", JSON.stringify(attendedClassesToday));
    localStorage.setItem("todayClasses", JSON.stringify(todayClasses));

    location.reload();
}

function getCurrentClubs() {
    return JSON.parse(localStorage.getItem("currentClubs"));
}

function getMaxClubs() {
    return localStorage.getItem("maxClubs");
}

function getPerksUsedToday() {
    return JSON.parse(localStorage.getItem("perksUsedToday"));
}

function getMaxPerkUses() {
    return JSON.parse(localStorage.getItem("maxPerkUses"));
}

function leaveClub(thisClub) {
    let currentClubs = getCurrentClubs();
    if (arrayIncludesObjectWithId(currentClubs, thisClub) == false) {
        alert("You haven't joined this club");
        return;
    }
    let indexOfCurrentClub = currentClubs.findIndex(x => x.id == thisClub.id);
    currentClubs.splice(indexOfCurrentClub, 1);

    localStorage.setItem("completedClubActivities", JSON.stringify([]));
    localStorage.setItem("currentPerkUses", "0");

    if (thisClub.id == 4) {
        localStorage.setItem("advancedClassesRequired", "3");
        localStorage.setItem("maxClasses", "4");
        localStorage.setItem("maxClubs", "1");
        localStorage.setItem("maxPunishments", "5");
    }

    localStorage.setItem("currentClubs", JSON.stringify(currentClubs));
    alert("You have left the " + thisClub.name);
}

function getCompletedClubActivities() {
    return JSON.parse(localStorage.getItem("completedClubActivities"));
}

function getCurrentPerkUses() {
    return JSON.parse(localStorage.getItem("currentPerkUses"));
}

/*
**********************
PROGRESS PAGE
**********************
*/
function viewProgressPage() {
    if (loadCurrentMajor() == false) {
        return;
    }
    ;
    loadCurrentClasses();
    loadMandatoryClasses();
    loadCompletedClasses();
    loadPendingPunishments();
    loadClubs();
    loadProgressCounters();
    loadGraduateButton();

    function loadCurrentMajor() {
        let currentMajor = getCurrentMajor();
        if (currentMajor != null) {
            $('#major-not-signed-up').hide();
        }
        if (currentMajor == null) {
            $('#progress-page-content').hide();
            return false;
        }

        //Append Major info to page
        let imgUrl = "img/major" + currentMajor.id + ".jpg";
        let majorObject =
            $('<div class="major-info">')
                .append($('<div class="row">')
                    .append($('<div class="col">')
                        .append($('<img class="img-fluid" style="max-height: 300px">').attr('src', imgUrl)))
                    .append($('<div class="col">')
                        .append($('<h4>').text(currentMajor.name))
                        .append($('<p>').text(currentMajor.description)
                        )
                    )
                );


        $('#progressLoadMajor').append(majorObject)
    }

    function loadCurrentClasses() {
        let currentClasses = getCurrentClasses();
        let currentClassesSorted = currentClasses.sort((a, b) => a.id > b.id);

        let container = $('#progressLoadClasses');
        let row = $('<div class="row">');

        for (let thisClass of currentClassesSorted) {
            let cardCol = $('<div class="col-auto">');
            let imgUrl = "img/" + "class" + thisClass.id + ".jpg";

            let card = $('<div class="card border-dark" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h4 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));

            row.append(cardCol.append(card));
        }

        container.append(row);

        $('#currentClassesNum').text(currentClasses.length);
        $('#maxCurrentClasses').text(localStorage.getItem("maxClasses"));

    }


    function loadMandatoryClasses() {
        let currentMajor = getCurrentMajor();
        let classesData = getClassesData();
        let mandatoryClassesIds = traversePrerequisites(currentMajor);

        let completedClasses = getCompletedClasses();

        let container = $('#progressMandatoryClasses');
        let row = $('<div class="row">');

        for (let classId of mandatoryClassesIds) {
            let thisClass = classesData.find(x => x.id == classId);

            let cardCol = $('<div class="col-auto">');
            let imgUrl = "img/" + "class" + thisClass.id + ".jpg";

            let card = $('<div class="card border-dark" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h4 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));


            if (arrayIncludesObjectWithId(completedClasses, thisClass) === true) {
                card.append($('<a href="" class="btn btn-success disabled">Completed</a>'))
            }
            row.append(cardCol.append(card));
        }
        container.append(row);
    }

    function loadCompletedClasses() {
        let completedClasses = getCompletedClasses();
        let completedClassesSorted = completedClasses.sort((a, b) => a.id - b.id);

        let container = $('#progressLoadCompletedClasses');
        let row = $('<div class="row">');

        if (completedClasses.length <= 0) {
            container.append(
                row.append(
                    $('<div class="col">').append(
                        $('<h4>').text("None")
                    )));
        }
        for (let thisClass of completedClassesSorted) {
            let cardCol = $('<div class="col-auto">');
            let imgUrl = "img/" + "class" + thisClass.id + ".jpg";

            let card = $('<div class="card border-dark" style="width:18rem; height: 400px">');
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "class.html?classId=" + thisClass.id;
            })
                .append($('<h4 class="card-title">').text(thisClass.name)
                    .append($('<h5>').text((thisClass.tier).charAt(0).toUpperCase() + thisClass.tier.slice(1))));

            row.append(cardCol.append(card));

        }
        container.append(row);
    }

    function loadPendingPunishments() {
        let currentPunishments = getCurrentPunishments();

        let container = $('#progressLoadPunishments');
        let punishmentsRow = $('<div class="row">');

        for (let thisPunishment of currentPunishments) {
            let col = $('<div class="col-auto">');
            let card = $('<div class="card" style="width:18rem; height: 400px">');

            let imgUrl = "img/" + "punishment" + thisPunishment.id + ".jpg";
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "punishment.html?punishmentId=" + thisPunishment.id;
            })
                .append($('<h5 class="card-title">').text(thisPunishment.name));

            $(punishmentsRow).append(col.append(card));
        }
        container.append(punishmentsRow);

        $('#currentPunishmentsNum').text(currentPunishments.length);
        $('#maxPunishmentsNum').text(getMaxPunishments());
    }

    function loadClubs() {
        let currentClubs = getCurrentClubs();

        let container = $('#progressLoadClubs');
        let row = $('<div class="row">');

        for (let thisClub of currentClubs) {
            let col = $('<div class="col-auto">');
            let card = $('<div class="card" style="width:18rem; height: 400px">');

            let imgUrl = "img/" + "club" + thisClub.id + ".jpg";
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "club.html?clubId=" + thisClub.id;
            })
                .append($('<h5 class="card-title">').text(thisClub.name));

            $(row).append(col.append(card));
        }
        container.append(row);

        $('#currentClubsNum').text(currentClubs.length);
        $('#maxClubsNum').text(getMaxClubs());
    }

    function loadProgressCounters() {
        let completedClasses = getCompletedClasses();
        let completedCoreClassesNum = 0;
        let completedBaseClassesNum = 0;
        let completedAdvancedClassesNum = 0;
        let completedMasterClassesNum = 0;

        let maxAdvancedClassesNum = JSON.parse(localStorage.getItem("advancedClassesRequired"));

        for (let _class of completedClasses) {
            if (_class.tier == "core") completedCoreClassesNum++;
            else if (_class.tier == "base") completedBaseClassesNum++;
            else if (_class.tier == "advanced") completedAdvancedClassesNum++;
            else if (_class.tier == "master") completedMasterClassesNum++;
        }
        $('#completedCoreClassesNum').text(completedCoreClassesNum);
        $('#completedBaseClassesNum').text(completedBaseClassesNum);
        $('#completedAdvancedClassesNum').text(completedAdvancedClassesNum);
        $('#maxAdvancedClassesNum').text(maxAdvancedClassesNum);
        $('#completedMasterClassesNum').text(completedMasterClassesNum);

        let punishmentsDoneNum = localStorage.getItem("punishmentsDoneNum");
        $('#punishmentsDoneNum').text(punishmentsDoneNum);

        let clubActivitiesDoneNum = localStorage.getItem("clubActivitiesDoneNum");
        $('#clubActivitiesDoneNum').text(clubActivitiesDoneNum);


        let currentPerkUses = getCurrentPerkUses();
        let clubPerksUsedToday = getPerksUsedToday();
        let maxClubPerkUses = getMaxPerkUses();

        $('#clubPerksLeft').text(currentPerkUses);
        $('#clubPerksUsedToday').text(clubPerksUsedToday);
        $('#clubPerkUsesMax').text(maxClubPerkUses);
    }

    function loadGraduateButton() {
        let graduateButtonContainer = $('.progressButtonGraduate');

        let button = $('<a href="" class="btn btn-success">Graduate!</a>').click(graduateMajor.bind(this, null));
        graduateButtonContainer.append(button);
    }
}


/*
**********************
SCHEDULE PAGE
**********************
*/
function viewSchedulePage() {
    countDownTillEndOfDay();
    scheduleUpdateDayte();
    scheduleGetMajorInfo();
    scheduleGetPunishments();
    scheduleGetTodayClasses();
    scheduleGetClubActivities();

    function scheduleUpdateDayte() {
        $("#dayToday").text(getTodayName());
    }

    function scheduleGetMajorInfo() {
        if (localStorage.getItem("currentMajor") !== null) {
            $("#major-not-signed-up").hide();
        }
        else {
            $('#schedule-page-content').hide();
            return;
        }
    }

    function scheduleGetPunishments() {
        let currentPunishments = getCurrentPunishments();

        let container = $('#scheduleLoadPunishments');

        let row = $('<div class="row">');
        for (let thisPunishment of currentPunishments) {
            let col = $('<div class="col-auto">');
            let card = $('<div class="card" style="width:18rem; height: 400px">');

            let imgUrl = "img/" + "punishment" + thisPunishment.id + ".jpg";
            card
                .append($('<img class="card-img-top">').attr('src', imgUrl)).click(function () {
                window.location.href = "punishment.html?punishmentId=" + thisPunishment.id;
            })
                .append($('<h5 class="card-title">').text(thisPunishment.name))
                .append($('<a href="schedule.html" class="btn btn-danger">Complete punishment</a>').click(completePunishment.bind(this, thisPunishment))
                );

            $(row).append(col.append(card));
        }
        container.append(row);
    }

    function scheduleGetTodayClasses() {
        setTodayClasses();

        let todayClasses = getTodayClasses();
        let todayClassesSorted = todayClasses.sort((a, b) => a.id > b.id);

        for (let thisClass of todayClassesSorted) {
            let objectInfo = $('<div class="object-info border-primary">');
            let mainInfoRow = $('<div class="row">');

            let leftCol = $('<div class="col text-center">');
            let rightCol = $('<div class="col text-left">');

            let imgUrl = "img/class" + thisClass.id + ".jpg";

            leftCol.append($('<img class="img-fluid" style="max-height: 250px">').attr('src', imgUrl));
            rightCol.append($('<h5>').text(thisClass.name));
            rightCol.append($('<p>').text(thisClass.description));

            mainInfoRow.append(leftCol);
            mainInfoRow.append(rightCol);
            objectInfo.append(mainInfoRow);

            objectInfo.append($('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h6>').text("Daily tasks:"))
                    .append($('<p>').append($('<b>').text("Option 1: ")).append($('<span>').text(thisClass.opt1)))
                    .append($('<p>').append($('<b>').text("Option 2: ")).append($('<span>').text(thisClass.opt2)))
                )
                .append($('<div class="col">')
                    .append($('<h6>').text("Exam:"))
                    .append($('<p>').append($('<b>').text("Option 1: ")).append($('<span>').text(thisClass.pass1)))
                    .append($('<p>').append($('<b>').text("Option 2: ")).append($('<span>').text(thisClass.pass2)))
                )
            );

            let buttonsRow = $('<div class="row">')
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-primary">Complete daily</a>').click(attendClass.bind(this, thisClass)
                    ))
                    .append($('<a href="" class="btn btn-warning">Skip (perk)</a>').click(useClubPerk.bind(this, thisClass)
                    ))
                    .append($('<a href="" class="btn btn-danger">Skip (punish)</a>').click(skipClass.bind(this, thisClass))
                    )
                )
                .append($('<div class="col">')
                    .append($('<a href="" class="btn btn-success">Pass Exam</a>').click(passClass.bind(this, thisClass)
                    ))
                    .append($('<a href="" class="btn btn-danger">Fail Exam</a>').click(skipClass.bind(this, thisClass)
                    ))
                );

            objectInfo.append(buttonsRow);
            $('#scheduleLoadClasses').append(objectInfo);
        }
    }

    function scheduleGetClubActivities() {
        let currentClubs = getCurrentClubs();

        for (let thisClub of currentClubs) {
            let objectInfo = $('<div class="object-info border-warning">');
            let mainInfoRow = $('<div class="row">');

            let leftCol = $('<div class="col text-center">');
            let rightCol = $('<div class="col text-left">');

            let imgUrl = "img/club" + thisClub.id + ".jpg";

            leftCol.append($('<img class="img-fluid" style="max-height: 250px">').attr('src', imgUrl));
            rightCol.append($('<h5>').text(thisClub.name));
            rightCol.append($('<p>').text(thisClub.description));

            mainInfoRow.append(leftCol);
            mainInfoRow.append(rightCol);
            objectInfo.append(mainInfoRow);

            objectInfo.append($('<div class="row">')
                .append($('<div class="col">')
                    .append($('<h6>').text("Perks:"))
                    .append($('<p>').append($('<b>').text("Perk 1: ")).append($('<span>').text(thisClub.perk1)))
                    .append($('<p>').append($('<b>').text("Perk 2: ")).append($('<span>').text(thisClub.perk2)))
                )
                .append($('<div class="col">')
                    .append($('<h6>').text("Jobs:"))
                    .append($('<p>').append($('<b>').text("Job 1: ")).append($('<span>').text(thisClub.job1)))
                    .append($('<p>').append($('<b>').text("Job 2: ")).append($('<span>').text(thisClub.job2)))
                )
            );
            if (thisClub.id != 4) {
                let buttonsRow = $('<div class="row">')
                    .append($('<div class="col">')
                        .append($('<a href="" class="btn btn-success">Complete Activity 1</a>').click(completeClubActivity.bind(this, 1)
                        ))
                        .append($('<span> </span>'))
                        .append($('<a href="" class="btn btn-success">Complete Activity 2</a>').click(completeClubActivity.bind(this, 2)
                        ))
                    );
                objectInfo.append(buttonsRow);
            }


            $('#scheduleLoadClubs').append(objectInfo);


        }
    }
}

/*
**********************
SETTINGS PAGE
**********************
*/
function resetMajor() {
    let completedMajors = getCompletedMajors();
    localStorage.clear();
    localStorage.setItem("completedMajors", JSON.stringify(completedMajors));
    alert("Major progress has been reset");
}

function resetGame() {
    localStorage.clear();
    alert("Game progress has been reset");
}

/*
**********************
OTHER
**********************
*/
function generateRandomNum(max) {
    //0 to max-1
    return Math.floor(Math.random() * max);
}

function getWeekdays() {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

function getTodayNum() {
    let d = new Date();
    let dayNum = d.getDay().toString();
    return dayNum;
}

function getTodayName() {
    let days = getWeekdays();
    let d = new Date();
    let dayNum = d.getDay().toString();
    let dayName = days[dayNum];
    return dayName;
}

function hasOneDayPassed() {
    let lastDate = getlastDate();
    let today = getTodayStart();

    if (today > lastDate) {
        //Clear done club activities for today
        localStorage.setItem("completedClubActivities", JSON.stringify([]));

        //Add perks from club 4

        //Punish player for incomplete classes during the day
        let attendedClassesToday = getAttendedClassesToday();
        let todayClasses = getTodayClasses();

        for (let todayClass of todayClasses) {
            if (arrayIncludesObjectWithId(todayClass, attendedClassesToday) === false) {
                rollPunishment(todayClass);
            }
        }

        //Clear attended classes today
        localStorage.setItem("attendedClassesToday", JSON.stringify([]));

        //Clear perk uses counter
        localStorage.setItem("perksUsedToday", "0");

        //Set new last date as toady
        localStorage.setItem("lastDate", JSON.stringify(today));
        return true;
    }
    return false;
}

function getTodayStart() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
}

function getlastDate() {
    return JSON.parse(localStorage.getItem("lastDate"));
}

function arrayIncludesObjectWithId(array, object) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == object.id) {
            return true;
        }
    }
    return false;
}

function countDownTillEndOfDay() {
    let today = getTodayStart();
    let tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate() + 1);

    let end = tommorow;

    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;
    let timer;

    function showRemaining() {
        let now = new Date();
        let distance = end - now;
        if (distance < 0) {

            clearInterval(timer);
            document.getElementById('countdown').innerHTML = 'EXPIRED!';

            return;
        }
        //let days = Math.floor(distance / _day);
        let hours = Math.floor((distance % _day) / _hour);
        let minutes = Math.floor((distance % _hour) / _minute);
        let seconds = Math.floor((distance % _minute) / _second);

        // document.getElementById('countdown').innerHTML = days + 'days ';
        document.getElementById('countdown').innerHTML = hours + 'hrs ';
        document.getElementById('countdown').innerHTML += minutes + 'mins ';
        document.getElementById('countdown').innerHTML += seconds + 'secs';
    }

    timer = setInterval(showRemaining, 1000);
}

function traversePrerequisites(child) {
    let result = [];

    traverse(child);

    function traverse(child) {
        //get node parents
        let parentIds = child.prerequisites.split(' ').filter((val) => val);

        //return if child node has no parent nodes
        if (parentIds.length == 0) {
            return;
        }

        //traverse parent nodes
        for (let parentId of parentIds) {
            let parent = getClassesData().find(x => x.id == parentId);

            //add parent node to result
            result.push(parent.id);

            //traverse parent node
            traverse(parent);
        }
    }

    let resultFinal = Array.from(new Set(result.sort((a, b) => a - b)));
    return resultFinal;
}

/*
**********************
Data
**********************
*/
function getMajorsData() {
    return JSON.parse(localStorage.getItem('majorsData'));
}

function getClassesData() {
    return JSON.parse(localStorage.getItem('classesData'));
}

function getClubsData() {
    return JSON.parse(localStorage.getItem('clubsData'));
}

function getPunishmentsData() {
    return JSON.parse(localStorage.getItem('punishmentsData'));
}

function initializeMajorsData() {
    let majorsData = [];
    let major1 = {
        id: '1',
        name: 'Anal Engineering',
        prerequisites: '206 302',
        days: '1 2 3 4 5 6 7',
        description: 'You will devote your life to an anal only lifestyle.',
        tier: 'major',
        opt1: 'none',
        opt2: 'none',
        pass1: 'Cum from anal 4 time this week while locked in chastity. Use a dildo (size XL). Cum only 2 times if you sleep with a buttplug (size L)',
        pass2: 'Cum from anal 2 times in a day while locked in chastity. Use a dildo (size XL). Dont clean up between sessions, stay locked up the entire time.',
        pass3: 'Have a real guy fuck your ass while you are wearing chastity.'
    };

    let major2 = {
        id: '2',
        name: 'Gender Studies',
        prerequisites: '303 304',
        days: '1 2 3 4 5 6 7',
        description: 'You will take control of your gender and become a female in all ways except one.',
        tier: 'major',
        opt1: 'none',
        opt2: 'none',
        pass1: 'Spend one whole month in chastity while wearing panties. You can cum only from anal.',
        pass2: 'Spend two full weeks in chastity while "dressed like a girl". You must fuck your ass with a dildo (size L) and listen to sissy hypno for 1 hour every day. Sleep with a buttplug every Monday, Wednesday and Friday.',
        pass3: 'Spend 3 full days dressed in "full sissy attire". Listen to 1 hours of sissy hypno every day. Spitroast yourself for 30 minutes every day (dildos size M and L).'
    };

    let major3 = {
        id: '3',
        name: 'Kink Psychology',
        prerequisites: '108 203 210 309',
        days: '1 2 3 4 5 6 7',
        description: 'You will study the effects of sexual frustration and pain on the human psyche.',
        tier: 'major',
        opt1: 'none',
        opt2: 'none',
        pass1: 'Edge yourself twice a day while sitting on a dildo (size L) or wearing a plug (size L). You must be kept in chastity for the rest of the time. Sleep with a buttplug (size M) during the night. Do this every day for a week. If you cum, even from anal, roll one punishment and add 1 day to your time.',
        pass2: 'Spread your sex toys (10 minimum) around your apartment but so that they can easily be reached by a toddler. Lock yourself in chastity and insert a buttplug (size L). Apply clothespins to your balls and nipples. Tie your hands and legs in a "bitchsuit/petplay" style so you walk on your elbows and knees. You can use knee and elbow pads to make it more comfortable. Start collecting your toys one by one by bringing them to a common place with your mouth. You are done when all the toys have been gathered at one place.',
        pass3: 'Edge yourself once a day for two weeks. Put clothespins on your nipples and balls while doing so. Lock yourself in chastity for the rest of the time. If you cum, even from anal, roll a punishment and add 1 day to your time.'
    };

    let major4 = {
        id: '4',
        name: 'Stuffing Science',
        prerequisites: '305 308',
        days: '1 2 3 4 5 6 7',
        description: 'You will take your ass and mouth to the limits of human understanding.',
        tier: 'major',
        opt1: 'none',
        opt2: 'none',
        pass1: 'Stuff two toys (any sizes) in your ass. Hold in place with panties and sit down on them. Deepthroat your largest dildo (size XL) for 10 seconds. 5 seconds if in chastity and "dressed like a girl". Deepthroat it like this 5 times.',
        pass2: 'Stuff your biggest plug in your (size XL). Deepthroat your largest dildo (size XL) 30 times. 20 if "dressed like a girl"',
        pass3: '"Dress like a girl" and insert you biggest buttplug (size XL) or two toys (any sizes) in your ass. Hold them with your panties and sit on them. Deepthroat your biggest dildo (size XL) for 20 seconds. 10 seconds if in chastity.'
    };

    let major5 = {
        id: '5',
        name: 'Fluid Dynamics',
        prerequisites: '205 206 301',
        days: '1 2 3 4 5 6 7',
        description: 'You will master all your sexual liquids.',
        tier: 'major',
        opt1: 'none',
        opt2: 'none',
        pass1: 'Fuck your ass and mouth with a dildo (size L) until you collect 10ml of precum and 50ml of saliva. Mix them with 500ml of your own piss and 1000ml water. Give yourself an enema with the resulting mix for 20 minutes. 10 if you do the whole procees while "dressed like a girl". You can use a plug of any size to hold the enema',
        pass2: 'Give yourself a 2000ml enema and plug it with a buttplug of your choice. Hold for 30 minutes. 20minutes if "dressed like a girl". Lick and deephroat a dildo (size L) in the meantime until you are covered with saliva',
        pass3: 'Give yourself a 3000ml enema and plug with with a buttplug of your choice. Hold for 20 minutes. 10 if you are "dressed like a girl".'
    };

    majorsData.push(major1);
    majorsData.push(major2);
    majorsData.push(major3);
    majorsData.push(major4);
    majorsData.push(major5);

    console.log("Majors data loaded");
    localStorage.setItem('majorsData', JSON.stringify(majorsData));
}

function initializeClassesData() {
    let class01 = {
        id: '101',
        name: 'Enema 101',
        prerequisites: '',
        days: '3 5',
        description: 'You will be taught how to clean yourself before anal.',
        tier: 'core',
        opt1: 'Take one 500ml enema and hold for 2 minutes',
        opt2: 'Take three 500ml enemas in a row',
        pass1: 'Hold a 500ml enema for 8 minutes',
        pass2: 'Hold a 750ml enema for 4 minutes'
    };

    let class02 = {
        id: '102',
        name: 'Anal 102',
        prerequisites: '',
        days: '3 5',
        description: 'You will discover new pleasure zones.',
        tier: 'core',
        opt1: 'Fuck your ass at 30BPM for 5 minutes with a dildo. (size S)',
        opt2: 'Wear a buttplug for 1 hour (size S)',
        pass1: 'Fuck your ass at 60bpm for 8 minutes with a dildo (size S)',
        pass2: 'Wear a buttplug for 2 hours (size S)'
    };

    let class03 = {
        id: '103',
        name: 'Chastity 103',
        prerequisites: '',
        days: '1 2 4 5',
        description: 'You will be eased into chastity and the concept of not touching your dick.',
        tier: 'core',
        opt1: 'Wear a chastity device for 2 hours today.',
        opt2: 'Wear a chastity device for 30 minutes while watching porn.',
        pass1: 'Wear a chastity device for 8 hours today.',
        pass2: 'Wear a chastity device for the night.'
    };

    let class04 = {
        id: '104',
        name: 'Femininity 104',
        prerequisites: '',
        days: '1 2 4 5',
        description: 'You will start exploring your feminine sides.',
        tier: 'core',
        opt1: 'Wear panties for 2 hours today.',
        opt2: 'Wear a bra for 2 hours today.',
        pass1: 'Wear a bra and panties for 8 hours today.',
        pass2: 'Listen to 1 hours of sissy hypno while wearing a bra and panties'
    };

    let class05 = {
        id: '105',
        name: 'Oral 105',
        prerequisites: '',
        days: '1 2 3',
        description: 'You will learn how to pleasure a dick with your mouth.',
        tier: 'core',
        opt1: 'Give a 5 minute blowjob to dildo (size S). Deepthroat once in the end.',
        opt2: 'Lick the shaft of a dildo 100times (size S). Deepthroat once in the end.',
        pass1: 'Deepthroat a dildo 10 times in 1 minute (size S).',
        pass2: 'Deepthroat a a dildo 30 times in one sitting (size S).'
    };

    let class06 = {
        id: '106',
        name: 'Prostate Play 106',
        prerequisites: '101 102',
        days: '2 4',
        description: 'You will learn how to feel pleasure from your prostate.',
        tier: 'base',
        opt1: 'Aim for your prostate. Fuck yourself at 30bmp for 20minutes with a dildo (size M)',
        opt2: 'Aim for your prostate. Fuck yourself at 60bmp for 10minutes with a dildo (size M)',
        pass1: 'Aim for your prostate. Fuck yourself at 90bmp for 10minutes with a dildo (size M)',
        pass2: 'Aim for your prostate. Fuck yourself at 120bmp for 5minutes with a dildo (size M)'
    };

    let class07 = {
        id: '107',
        name: 'Slave Training 107',
        prerequisites: '101 102 103 104 105',
        days: '1 5',
        description: 'Your first serious class, time to put your skills to the test like a proper sex slave',
        tier: 'base',
        opt1: 'Spit roast yourself for 10 minutes with two dildos (sizes S and M)',
        opt2: 'Attach clothespins to your balls and nipples. Watch porn for 10 minutes. If you arent locked you can have a ruined orgasm.',
        pass1: 'Spitroat yourself for 15minutes while in chastity. Use two two dildos (sizes M and M or M and L)',
        pass2: 'Attach clothespins to your balls and nipples. Spit roast yourself for 15minutes while in chastity. You can have an anal orgasm.'
    };

    let class08 = {
        id: '108',
        name: 'Buttplug Training 108',
        prerequisites: '101 102',
        days: '1 3 5',
        description: 'You will expand your anal horizons.',
        tier: 'base',
        opt1: 'Wear a buttplug (size S) for 8 hours today.',
        opt2: 'Wear a buttplug (size M) for 4 hours today',
        pass1: 'Wear a buttplug (size S) for 24 hours today.',
        pass2: 'Wear a buttplug (size M) for 12 hours today.'
    };

    let class09 = {
        id: '109',
        name: 'Edging 109',
        prerequisites: '',
        days: '2 4',
        description: 'You will learn to hold back your orgasms.',
        tier: 'base',
        opt1: 'Masturbate for 20 minutes and edge 5 times. You can have a ruined orgasm.',
        opt2: 'Masturbate for 30 minutes and edge 3 times. You can have a ruined orgasm.',
        pass1: 'Masturbate for 20 minutes and edge 5 times. No cumming allowed.',
        pass2: 'Masturbate for 30 minutes and edge 3 times. No cumming allowed.'
    };

    let class10 = {
        id: '110',
        name: 'Bondage 110',
        prerequisites: '107',
        days: '1 5',
        description: 'You will learn the art of selfbondage.',
        tier: 'base',
        opt1: 'Cuff your legs together while performing 1 other task from your workload.',
        opt2: 'Cuff your hands together while performing 1 other task from your workload.',
        pass1: 'Tie yourself in a hogtie for 40 minutes. (see Info)',
        pass2: 'Tie yourself in a hogtie for 20 minutes while blindfolded and gagged (see Info)'
    };

    let class11 = {
        id: '201',
        name: 'Advanced Enemas 201',
        prerequisites: '101',
        days: '1 3',
        description: 'You will learn to clean yourself before intense anal action.',
        tier: 'advanced',
        opt1: 'Take a 750ml enema for 10 minutes.',
        opt2: 'Take a 1000ml enema for 5 minutes',
        pass1: 'Take a 1000ml enema for 10 minutes',
        pass2: 'Take a 1500ml enema for 5 minutes'
    };

    let class12 = {
        id: '202',
        name: 'Advanced Anal 202',
        prerequisites: '106',
        days: '1 3 5',
        description: 'Learn how to take it in the ass, faster, deeper and more regularly.',
        tier: 'advanced',
        opt1: 'Face down, ass up. 60bpm anal for 10 minutes with a dildo. (size M). Stop if you cum.',
        opt2: 'Laying, legs up, 60bpm anal for 10 minutes with a dildo (size M). Stop if you cum.',
        pass1: 'Any poition - 60bpm anal for 30 minutes (size L). 20 minutes if you wear chastity. Stop if you cum.',
        pass2: 'Any poition - 90bpm anal for 20 minutes (size L). 10 minutes if you wear chastity. Stop if you cum.'
    };

    let class13 = {
        id: '203',
        name: 'Chastity 203',
        prerequisites: '103',
        days: '1 2 4 5',
        description: 'You will lear to go for longer periods of time locked in chastity.',
        tier: 'base',
        opt1: 'Wear a chastity device for 12 hours today.',
        opt2: 'Wear a chastity device while performing your daily workload.',
        pass1: 'Wear a chastity device for 24 hours straight. Fuck your ass for 10minutes at 60bpm atleast once while locked..',
        pass2: 'Wear a chastity device for 48hours straight.'
    };

    let class14 = {
        id: '204',
        name: 'Femininity 204',
        prerequisites: '104',
        days: '1 2 4 5',
        description: 'You will lear to dress and think like a girl. You might even get to cum like one.',
        tier: 'base',
        opt1: '"Dress like a girl" for 2 hours today.',
        opt2: '"Dress like a girl" for 1 hour today while locked in chastity. Listen to 30minutes of sissy hypno.',
        pass1: 'Have an anal orgasm while "dressed like a girl" and listening to sissy hypno.',
        pass2: 'Dress like a girl and spitroast yourself for 30 minutes (dildos size M and L). '
    };

    let class15 = {
        id: '205',
        name: 'Advanced Oral 205',
        prerequisites: '105',
        days: '2 3 4',
        description: 'You will learn how to deepthroat.',
        tier: 'advanced',
        opt1: 'Deepthroat a dildo 10 times in one minute. (size M)',
        opt2: 'Deepthroat a dildo 30 times in one sitting (size M)',
        pass1: 'Deepthroat a dildo for 10 seconds straight, 5 times. (size M)',
        pass2: 'Deepthroat a dildo for 30 seconds straight. (size M) 20 seconds if "dressed like a girl"'
    };

    let class16 = {
        id: '206',
        name: 'Milking 206',
        prerequisites: '106',
        days: '1 3 5',
        description: 'You will learn how to milk your prostate.',
        tier: 'advanced',
        opt1: 'Milk your prostate with a vibrator or a prostate massager (lowest speed) for 20 minutes.',
        opt2: 'Milk your prostate with a vibrator or a prostate massager (highest speed) for 10 minutes.',
        pass1: 'Milk your prostate with a vibrator or a prostate massager (medium speed) for 30 minutes. Keep going even if you cum.',
        pass2: 'Milk your prostate with a vibrator or a prostate massager (highest speed) for 45 minutes or until you cum.'
    };

    let class17 = {
        id: '208',
        name: 'Anal Stretching 208',
        prerequisites: '108',
        days: '2 4',
        description: 'You will expand your anal horizons with a larger set of plugs.',
        tier: 'advanced',
        opt1: 'Wear a buttplug for 12 hours (size M)',
        opt2: 'Wear a buttplug for 6 hours (size L)',
        pass1: 'Wear a (size M) buttplug for 24 hours.',
        pass2: 'Wear a (size L) buttplug for 12 hours.'
    };

    let class18 = {
        id: '209',
        name: 'Tease and denial 209',
        prerequisites: '109',
        days: '1 2 3',
        description: 'You will learn to stay on the edge and deny your orgasms. If you are locked in chastity, unlock yourself to complete your class workload. Dot forget to relock yourself after',
        tier: 'advanced',
        opt1: 'Masturbate for 30 minutes or until you edge 3 times. No cumming allowed.',
        opt2: 'Masturbate for 15 minutes or until you edge 2 times while riding a dildo (any size) or wearing a buttplug (any size). No cumming allowed.',
        pass1: 'Masturbate for 60 minutes or until you edge 10 times. No cumming allowed.',
        pass2: 'Masturbate for 30 minutes or until you edge 5 times, while riding a dildo or wearing a buttplug. No cumming allowed.'
    };

    let class19 = {
        id: '210',
        name: 'Heavy Bondage 210',
        prerequisites: '110',
        days: '2 4',
        description: 'You will learn to endure pain and punishment.',
        tier: 'advanced',
        opt1: 'Attach clothespins to your balls and nipples for 30 minutes.',
        opt2: 'Tie your legs in a frogtie for 30 minutes. (see Info)',
        pass1: 'Tie yourself in a hogtie for 60 minutes while gagged, blidfoded, locked in chastity and plugged. You can also use a dildo or a vibrator-low speed.',
        pass2: 'Tie yourself in a hogtie while gagged, locked in chastity and plugged (dildo/vibrator-low speed also works). Crawl from one room to the next like this and back. (minimum 10 meters)'
    };

    let class20 = {
        id: '302',
        name: 'Anal Only 302',
        prerequisites: '202',
        days: '1 2 3',
        description: 'You will learn to enjoy only anal.',
        tier: 'master',
        opt1: 'Lock yourself in chastity. Insert a vibrator/prostate massager (high speed). Hold in place with panties. Stay like this for 20 minutes. Keep going even if you cum.',
        opt2: 'Lock yourself in chastity. Fuck your ass with a dildo (size L) in any position at 60bpm for 20 minutes. Keep going even if you cum.',
        pass1: 'Apply chastity. Insert a vibrator/prostate massager (high speed) and hold in place with panties. You are allowed to grind on the vibrator/massager but no hands. Stay like this for 1 hour. Keep going even if you cum.',
        pass2: 'Apply chastity. Fuck your ass with a dildo (size L) in any position at 90bpm for 30 minutes. Keep going even if you cum.'
    };

    let class26 = {
        id: '301',
        name: 'Advanced Enemas 301',
        prerequisites: '201',
        days: '1 2 4 5',
        description: 'You will learn to hold large amounts of liquids.',
        tier: 'master',
        opt1: 'Take a 1000ml enema for 10 minutes.',
        opt2: 'Take a 1500ml enema for 5 minutes.',
        pass1: 'Take a 2000ml enema for 10 minutes.',
        pass2: 'Take a 1500ml enema for 20 minutes'
    };

    let class21 = {
        id: '303',
        name: 'Longterm chastity 303',
        prerequisites: '203',
        days: '1 2 3 4 5',
        description: 'Your penis will never be touched again.',
        tier: 'master',
        opt1: 'Wear a chastity device for 24 hours today. You will only be free on weekends',
        opt2: 'Wear a chastity device for 23 hours today (no touching when free). Skip Wednesdays. Sleep with a buttplug <size M)',
        pass1: 'Spend two full weeks in chastity. Remove only for cleaning.',
        pass2: 'Spend one full week in chastity. Sleep with a buttplug (size M). Remove only for cleaning.'
    };

    let class22 = {
        id: '304',
        name: 'Gender Reassignment 304',
        prerequisites: '204',
        days: '1 2 4 5',
        description: 'After this class nobody will be able to tell you were a boy. Not even you.',
        tier: 'master',
        opt1: '"Dress like a girl" for 2 hours today. Listen to 1 hour of sissy hypno.',
        opt2: '"Dress like a girl and lock yourself in chastity for 2 hours today.',
        pass1: 'Cum from anal two times in one day while dressed in "Full sissy attire". Listen to sissy hypno for 2 hours minimum.',
        pass2: 'Dress in "full sissy attire" for 24 hours. 12 hours if you spend 2 of them listening to sissy hypno while doing the "isolation punishment".'
    };
    let class23 = {
        id: '305',
        name: 'Deep Oral 305',
        prerequisites: '205',
        days: '2 3 4',
        description: 'Your mouth will become as good if not better than your ass at pleasing a cock.',
        tier: 'master',
        opt1: 'Deepthroat a dildo (size L) 60 times in one sitting. 30 times if dressed in "full sissy attire". You can replace the buttplug with another dildo (size M)',
        opt2: 'Deepthroat a dildo (size L) for 30 seconds straight. 20 second  if dressed in "full sissy attire". You can replace the buttplug with another dildo (size M)',
        pass1: 'Deepthroat a dildo (size L) 120 times. 60 times  if dressed in "full sissy attire". You can replace the buttplug with another dildo (size M)',
        pass2: 'Deepthroat a dildo (size L) for 60 seconds straight. 30 seconds  if dressed in "full sissy attire". You can replace the buttplug with another dildo (size M)'
    };
    let class24 = {
        id: '308',
        name: 'Stuffing 308',
        prerequisites: '205 208',
        days: '2 4',
        description: 'You will be trained to take in multiple toys at once.',
        tier: 'master',
        opt1: 'Insert a dildo (size L) in your ass and hold in place with panties for 10 minutes. Deepthroat another one (size M) 10 times in the meantime.',
        opt2: 'Inset a buttplug (size L) in your ass for 10 minutes. Deepthroat a dildo (size L) 10 times in the meantime.',
        pass1: 'Insert a dildo (size L) in your ass and hold in place with panties for 20 minutes. After you finish insert a buttplug (size L) and deepthroat the same dildo 50 times in one siting.',
        pass2: 'Inset a buttplug (size L) in your ass. Deepthroat a dildo (size L) for 20 seconds straight at least 5 times in one sitting.'
    };
    let class25 = {
        id: '309',
        name: 'Orgasm Denial 309',
        prerequisites: '209',
        days: '1 2 4 5',
        description: 'You will be trained to stay horny permanently and forget what orgasms feel like.',
        tier: 'master',
        opt1: 'Edge 5 times in one sitting today. Or once in the morning, once in the afternoon and once before bed. No cumming allowed.',
        opt2: 'Edge 3 times in one sitting while riding a dildo or wearing a buttplug. No cumming allowed.',
        pass1: 'Edge 2 times a day for a week (even weekends). Dont cum, even from anal. Milking is allowed.',
        pass2: 'Edge once a day for a week (even weekends) while riding a dildo. Dont cum, even from anal. Milking is allowed'
    };

    let classesData = [];
    classesData.push(class01);
    classesData.push(class02);
    classesData.push(class03);
    classesData.push(class04);
    classesData.push(class05);
    classesData.push(class06);
    classesData.push(class07);
    classesData.push(class08);
    classesData.push(class09);
    classesData.push(class10);
    classesData.push(class11);
    classesData.push(class12);
    classesData.push(class13);
    classesData.push(class14);
    classesData.push(class15);
    classesData.push(class16);
    classesData.push(class17);
    classesData.push(class18);
    classesData.push(class19);
    classesData.push(class26);
    classesData.push(class20);
    classesData.push(class21);
    classesData.push(class22);
    classesData.push(class23);
    classesData.push(class24);
    classesData.push(class25);

    console.log("Classes Data loaded");
    localStorage.setItem('classesData', JSON.stringify(classesData));
}

function initializeClubsData() {
    let club1 = {
        id: '1',
        name: 'Stripping club',
        days: '0',
        description: 'Get your holes filled!',
        perk1: 'Skip a class.',
        perk2: 'Skip a class.',
        job1: 'Fuck your ass at 60bpm for 10 minutes with a dildo. (size M).',
        job2: 'Deepthroat a dildo 10 times in one minute. (size M)',
    };
    let club2 = {
        id: '2',
        name: 'Maid Club',
        days: '0',
        description: 'We make house chores fun! Requires: maid outfit',
        perk1: 'Skip a class today.',
        perk2: 'Skip a class today.',
        job1: 'Dress in a maid outfit. Put on chastity and insert a dildo, hold it with your panties. Clean your room for 15minutes.',
        job2: 'Dress in a maid outfit for the rest of your daily workload.',
    };
    let club3 = {
        id: '3',
        name: 'Experimental club',
        days: '0',
        description: 'Do random challenges.',
        perk1: 'Skip two classes.',
        perk2: 'Skip two classes.',
        job1: 'Roll a random punishment.',
        job2: 'Roll a random punishment.',
    };

    let club4 = {
        id: '4',
        name: 'Elite Students club',
        days: '0',
        description: 'Be part of the school\'s elite. Get rewarded with free class skips every day but also get punished accordingly.',
        perk1: 'Skip one class a day. (gain automatically)',
        perk2: 'Skip one class a day. (gain automatically)',
        job1: 'Join one extra advanced class (green). You\'ll need to complete its prerequisites too. You can join one extra club.',
        job2: 'Increase maximum number of clubs to 2. Increase maximum number of enrolled classes to 5. Increase maximum number of punishments to 9.',
    };
    let club5 = {
        id: '5',
        name: 'Science club',
        days: '0',
        description: 'Playing with machines and electricity. Requires: estim, fucking machine',
        perk1: 'Skip a class.',
        perk2: 'Skip a class.',
        job1: 'Spend 20 minutes with estim (electro) on your dick.',
        job2: 'Spend 20 minutes on a fucking machine.',
    };
    let club6 = {
        id: '6',
        name: 'Literature club',
        days: '0',
        description: 'Read lewd manga.',
        perk1: 'Skip a class.',
        perk2: 'Skip a class.',
        job1: 'Read 30 minutes of hentai today while locked in chastity.',
        job2: 'Read 30 minutes of hentai today while locked in chastity and with a dildo (size  M) or a vibrator up your ass.',
    };
    let club7 = {
        id: '7',
        name: 'Meditation club',
        days: '0',
        description: 'Spend more time with your thoughts.',
        perk1: 'Skip a class.',
        perk2: 'Skip two classes.',
        job1: 'Roll the "Isolation" punishment',
        job2: 'Spend 30 minutes tied in a hogtie or mummified - blindfolded, gagged, locked in chastity with a buttplug (size M) in. Listen to sissy hypno or white noise on headphones while like this"',
    };
    let club8 = {
        id: '8',
        name: 'Petplay club',
        days: '0',
        description: 'Do you like pets? Well now you\'ll get to be one',
        perk1: 'Skip a class.',
        perk2: 'Skip two classes.',
        job1: 'Spend 30 minutes as a "pet".',
        job2: 'Spend 30 minutes as a "bitch".',
    };
    let club9 = {
        id: '9',
        name: 'Bondage club',
        days: '0',
        description: 'Join this club if bondage is your passion.',
        perk1: 'Skip a classes.',
        perk2: 'Skip two classes.',
        job1: 'Spend 20 minutes in a frogtie with a vibrator up your ass.',
        job2: 'Spend 30 minutes in a hogtie - blindfolded, gagged, with chastity and buttplug on.',
    };
    let club10 = {
        id: '10',
        name: 'Latex fashion club',
        days: '0',
        description: 'Dress in exotic materials. Requires: latex clothing',
        perk1: 'Skip a class.',
        perk2: 'Skip two classes.',
        job1: 'Spend 20 minutes dressed in latex today.',
        job2: 'Roll a random punishment and complete it while dressed in a latex.',
    };
    let club11 = {
        id: '11',
        name: 'Human relations club',
        days: '0',
        description: 'Improve your human interactions and relationships.',
        perk1: 'Skip two classes.',
        perk2: 'Skip two classes.',
        job1: 'Suck a real dick today.',
        job2: 'Have a real dick fuck your ass today.',
    };
    let club12 = {
        id: '12',
        name: 'Media Club',
        days: '0',
        description: 'Inspire the world by showing it yours',
        perk1: 'Skip two classes.',
        perk2: 'Skip two classes',
        job1: 'Upload a photo of you while in chastity on the web.',
        job2: 'Upload a video of you fucking your ass while in chastity on the web.',
    };

    let clubsData = [];
    clubsData.push(club1);
    clubsData.push(club2);
    clubsData.push(club3);
    clubsData.push(club4);
    clubsData.push(club5);
    clubsData.push(club6);
    clubsData.push(club7);
    clubsData.push(club8);
    clubsData.push(club9);
    clubsData.push(club10);
    clubsData.push(club11);
    clubsData.push(club12);


    localStorage.setItem("clubsData", JSON.stringify(clubsData));
    console.log("ClubsData loaded");
}

function initializePunishmentsData() {
    let punishment1 = {
        id: '1',
        name: 'Isolation',
        description: 'Spend 30 minutes in Isolation - Lock yourself in chastity and insert a buttplug. Put a blindfold and a gag on (alternative you you can use a hood). Tie your yourself with belts like shown in the picture. Your legs around the ankles, knees and your hands around your hips and chest. Alternative you you can mummify yourself in plastic wrap or use a leather/latex sleep sack. Listen so sissy hypno or white noise while like this.'
    };
    let punishment2 = {
        id: '2',
        name: 'Feminization',
        description: 'Dress "like a girl" (panties, bra, stockings/pantyhose, skirt/dress) for the rest of your daily workload (includes tasks, exams, other punishments and club activities)'
    };
    let punishment3 = {
        id: '3',
        name: 'Hypnosis',
        description: 'You are forced to listen to sissy hypno for 1 hour while fingering yourself or fiddling with your buttplug.'
    };
    let punishment4 = {
        id: '4',
        name: 'Spanking',
        description: 'You are forced to spank your ass 30times on each cheek. Roll another punishment if you\'re not bright red by the end of it.'
    };
    let punishment5 = {
        id: '5',
        name: 'Slave training',
        description: 'Lock yourself in chastity. Insert a dildo (size L) in your ass. Take as much time as you need. Then deepthroat your next smaller one (size M) 5 times'
    };
    let punishment6 = {
        id: '6',
        name: 'Heavy Bondage',
        description: 'Spend 60 minuties in a hogtie. 30 minutes if blindfolded, gagged, plugged and in chastity.'
    };
    let punishment7 = {
        id: '7',
        name: 'Enema',
        description: 'You are forced to bent over a desk and given a 1000ml enema. Hold it for 10 minutes. If you spill any reroll punishment.'
    };
    let punishment8 = {
        id: '8',
        name: 'Bondage',
        description: 'Tie your legs in a frogtie for 30 minutes. '
    };
    let punishment9 = {
        id: '9',
        name: 'Inflation',
        description: 'You are forced to drink 1000ml of water. Then take a 1000ml enema for 10minutes. You\'re not allowed to go to the restroom until you finish.'
    };
    let punishment10 = {
        id: '10',
        name: 'Denial',
        description: 'You are forced to insert a buttplug (size M) and edge 5 times while watching porn. If you\'re locked in chastity you can unlock yourelf for this task. If you cum roll another punishment.'
    };
    let punishment11 = {
        id: '11',
        name: 'Petplay',
        description: 'You are forced to spend 30 minutes as a "pet". You can do your other tasks during this time (if possible)'
    };
    let punishment12 = {
        id: '12',
        name: 'Humiliation',
        description: 'You are forced to write something degrading on your body and not tremove it for the rest of the day. Examples: Anal Slut, Sissy Whore, Slave, Fucktoy'
    };
    let punishment13 = {
        id: '13',
        name: 'Maid Service',
        description: 'You are forced to lock yourself in chastity and insert a prostate massager/vibrator. Cuff your wrists and ankles and sweep/dust/vacuum your room for a minimum 30minutes. If you dress as a maid you can reduce the time to half.'
    };
    let punishment14 = {
        id: '14',
        name: 'Anal stuffing',
        description: 'You are forced to put a balloon in your ass and fill it with 100ml of water. You are to keep it in there for the rest of your "daily workload".'
    };
    let punishment15 = {
        id: '15',
        name: 'Hardcore petplay',
        description: 'You are forced to spend 30 minutes as a "bitch". You can do other tasks in the meantime if possible.'
    };
    let punishment16 = {
        id: '16',
        name: 'Group punishment',
        description: 'The entire class got held behind because of you so they decided to give you a lesson. First they punish you by attaching clothespins to your balls and  nipples and locking you in chastity (you can avoid the clothespins if you "dress like a girl"). Then they take turns fucking your ass and mouth. They fuck you from behind at 60bpm for 10 minutes (dildo size M). Then they make you give them 20 deepthroats (dildo size M). You can remove the clothespins after they are done with you.'
    };
    let punishment17 = {
        id: '17',
        name: 'Asphyxiation',
        description: 'You are forced to put a plastic bag on your head and tie it around your neck. You can use a rubber band (recommended) or a belt/rope/collar. Keep it on for 2 minutes while you sit on a dildo (size M)'
    };
    let punishment18 = {
        id: '18',
        name: 'Deepthroat',
        description: 'Deepthroat a dildo (size L) for 5 seconds while locked in chastity. Do this 3 times.'
    };
    let punishment19 = {
        id: '19',
        name: 'Chastity',
        description: 'Complete the rest of your daily workload while locked in chastity.'
    };

    let punishments = [];
    punishments.push(punishment1);
    punishments.push(punishment2);
    punishments.push(punishment3);
    punishments.push(punishment4);
    punishments.push(punishment5);
    punishments.push(punishment6);
    punishments.push(punishment7);
    punishments.push(punishment8);
    punishments.push(punishment9);
    punishments.push(punishment10);
    punishments.push(punishment11);
    punishments.push(punishment12);
    punishments.push(punishment13);
    punishments.push(punishment14);
    punishments.push(punishment15);
    punishments.push(punishment16);
    punishments.push(punishment17);
    punishments.push(punishment18);
    punishments.push(punishment19);

    console.log("Punishments Data Loaded");
    localStorage.setItem("punishmentsData", JSON.stringify(punishments));
}
