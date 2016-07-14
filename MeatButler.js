//https://thefoodvillain.files.wordpress.com/2013/04/meat_temp_chart_photo.jpg

var meatObject = [
    {
        "meatGenre":"BEEF",
        "meatSynonyms":["BEEF","VEAL","LAMB","STEAK"],
        "rarityNeeds":1,
        "rarityTemps":[125,132,140,147,155]
    },
    {
        "meatGenre":"CHICKEN",
        "meatSynonyms":["CHICKEN","TURKEY"],
        "rarityNeeds":0,
        "rarityTemps":[165,165,165,165,165]
    },
    {
        "meatGenre":"POULTRY",
        "meatSynonyms":["POULTRY","DUCK","GOOSE"],
        "rarityNeeds":0,
        "rarityTemps":[155,155,155,155,155]
    },
    {
        "meatGenre":"PORK",
        "meatSynonyms":["PORK"],
        "rarityNeeds":1,
        "rarityTemps":[140,143,145,150,155]
    },
    {
        "meatGenre":"HAM",
        "meatSynonyms":["HAM"],
        "rarityNeeds":0,
        "rarityTemps":[140,140,140,140,140]
    },
    {
        "meatGenre":"WHITEFISH",
        "meatSynonyms":["FISH","TROUT"],
        "rarityNeeds":0,
        "rarityTemps":[140,140,140,140,140]
    },
    {
        "meatGenre":"TUNA",
        "meatSynonyms":["TUNA"],
        "rarityNeeds":0,
        "rarityTemps":[120,120,120,120,120]
    },
    {
        "meatGenre":"SALTFISH",
        "meatSynonyms":["SALMON","MARLIN","SWORDFISH"],
        "rarityNeeds":0,
        "rarityTemps":[135,135,135,135,135]
    }
];

var flavorStatements = [
    {
        "service":"delighted to serve you",
        "flavor":" to be at it's most divine"
    },
    {
        "service":"positively tickled",
        "flavor":"to inspire the palate"
    },
        {
        "service":"happy to be here",
        "flavor":" for a most delectible delicacy"
    },
        {
        "service":"eager to help",
        "flavor":", and with a cocktail if it please you"
    },
    
];



function getMeatGenre(meatType,callback){
    callback = -1;
    console.log("You picked meat " + meatType.toUpperCase());
    for(i=0; i<meatObject.length; i++){
        testObject = meatObject[i];
        for(x=0; x<testObject.meatSynonyms.length; x++){
            console.log("Is ." + meatType + ". the same as this." + testObject.meatSynonyms[x] + ".");
            if (testObject.meatSynonyms[x].localeCompare(meatType.toUpperCase())===0)
            {
                callback = i;
                break;
            }
        }
    }
    console.log("You picked meat " + callback);
    return callback;
}

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.application.applicationId !== "*****") {
             context.fail("Invalid Application ID");
        }
        

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
    console.log("MeatButler onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);
    getWelcomeResponse(callback);
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
}

function onIntent(intentRequest,session,callback){
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);
    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;
    console.log('Intent made ' + intentName);
    switch (intentName){
        case "MeatOnlyIntent":
            console.log('Intent made ' + intentName);
            respondToMeatInSession(intent, session, callback);
            break;
        case "RarityOnlyIntent":
            console.log('Intent made ' + intentName);
            respondToRarityInSession(intent, session, callback);
            break;
        case "MeatandRarityIntent":
            console.log('Intent made ' + intentName);
            respondToMeatAndRarityInSession(intent, session, callback);
            break;
        case "HelpIntent":
            getHelpResponse(callback);
            break;
        case "AMAZON.StopIntent":
            getStopResponse(callback);
            break;
        default:
            throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var flavorSelection = Math.floor(Math.random()*4);
    console.log("random selection " + flavorSelection);
    var speechOutput = "Hello, Welcome to Meat Butler. " + flavorStatements[flavorSelection].service +
        " What can I aid you in preparing today?";
    var repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
        "or other options. Let me know by saying I am making beef.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "At your service";
    var speechOutput = "I am your humble servant in the kitchen, to help you prepare your meat "
        + "to your precise specifications. Let me know what type of meat you are preparing, for example beef, "
        + "pork, chicken, fish. If it is a meat that should be prepared to a certain rarity, you can let me " 
        + "know how you like it from rare to well done. If you want you make a delicious steak, you might "
        + " ask me 'how do I make a medium rare steak?' "
        + " So tell me, what can I aid you in preparing today?";
    var repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
        "or other options. Let me know by saying I am making beef.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


function getStopResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Goodbye";
    var speechOutput = "Goodbye";
    var shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, shouldEndSession));
}

function respondToMeatInSession(intent, session, callback) {
    var cardTitle = "Let's cook";
    var meatSlot = intent.slots.meatType;
    var meatID = -1;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    if (meatSlot) {
        var meatType = meatSlot.value;
        meatID = getMeatGenre(meatType);
        if (meatID===-1){
            speechOutput = "I'm dreadfully sorry, I don't know how to prepare " + meatType + ". Is there something else you wanted to make?";
            repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
            "or other options. Let me know by saying I am making beef.";
        } else if(session.attributes){
            if (session.attributes.rarityType){
                speechOutput = getTemperature(meatType,meatID,session.attributes.rarityType);
                cardTitle = 'A delightful ' + session.attributes.rarityType + " " + meatType;
                shouldEndSession = true;
            }
        } else {
            if (meatObject[meatID].rarityNeeds===0){
                speechOutput = getTemperature(meatType,meatID,-1);
                cardTitle = 'A delightful ' + meatType;
                shouldEndSession = true;
            } else {
                sessionAttributes = buildMeatTypeAttributes(meatType,meatID);
                speechOutput = "I love " + meatType + ". How would you like too cook it? ";
                cardTitle = 'How to serve your ' + meatType;
                repromptText = "You can tell me you want to make rare, medium rare, medium or well done meat." +
                 "Let me know how you want to cook it by saying, I like my meat medium.";
            }
        }
    } else {
        speechOutput = "I'm dreadfully sorry, I didn't catch that. What was it you wanted to make?";
        repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
            "or other options. Let me know by saying I am making beef.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function respondToMeatAndRarityInSession(intent, session, callback) {
    var cardTitle = "Let's cook";
    var meatSlot = intent.slots.meatType;
    var raritySlot = intent.slots.rarityType;
    var meatID = -1;
    var speechOutput = "";
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;


    if (meatSlot) {
        var meatType = meatSlot.value;
        meatID = getMeatGenre(meatType);
        if (meatID===-1){
            speechOutput = "I'm dreadfully sorry, I don't know how to prepare " + meatType + ". Is there something else you wanted to make?";
            repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
            "or other options. Let me know by saying I am making beef.";
        } else if(raritySlot){
            //do rarity stuff here
            var rarityType = raritySlot.value
            console.log('RarityType ' + rarityType + ' raritySlot ' + raritySlot.value)
            if (getRarityLevel(rarityType)===-1) {
                speechOutput = "I'm dreadfully sorry, I didn't catch that. How would you like to prepare your meal?";
                repromptText = "You can let me know you want it rare, medium rare, medium, medium well, or well done.";
            } else {
                speechOutput = getTemperature(meatType,meatID,rarityType);
                cardTitle = "A delightful " + rarityType + " " + meatType;
                shouldEndSession = true;
            }
        } else {
            if (meatObject[meatID].rarityNeeds===0){
                speechOutput = getTemperature(meatType,meatID,-1);
                cardTitle = 'A delightful ' + meatType;
                shouldEndSession = true;
            } else {
                sessionAttributes = buildMeatTypeAttributes(meatType,meatID);
                speechOutput = "I love " + meatType + ". How would you like too cook it? ";
                cardTitle = 'How to serve your ' + meatType;
                repromptText = "You can tell me you want to make rare, medium rare, medium or well done meat." +
                 "Let me know how you want to cook it by saying, I like my meat medium.";
            }
        }
    } else {
        speechOutput = "I'm dreadfully sorry, I didn't catch that. What was it you wanted to make?";
        repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
            "or other options. Let me know by saying I am making beef.";
    }



    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function respondToRarityInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var raritySlot = intent.slots.rarityType;
    var repromptText = "";
    var rarityType = raritySlot.value;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    console.log(rarityType)

    if (getRarityLevel(rarityType)===-1) {
        speechOutput = "I'm dreadfully sorry, I didn't catch that. How would you like to prepare your meal?";
        repromptText = "You can let me know you want it rare, medium rare, medium, medium well, or well done.";
    } else if (raritySlot){
        sessionAttributes = buildRarityAttributes(rarityType);
        if(session.attributes){
            if (session.attributes.meatType){
                speechOutput = getTemperature(session.attributes.meatType,session.attributes.meatID,rarityType);
                cardTitle = "A delightful " + session.attributes.rarityType + " " + session.attributes.meatType;
                shouldEndSession = true;
            }
        } else {
            cardTitle = "What to serve " + rarityType;
            speechOutput = "I love " + rarityType + ". What meat are we cooking today? ";
            repromptText = "You can let me know you are preparing beef, pork, chicken, lamb, turkey, fish " +
                "or other options by saying I am making pork";
        }
    } else {
        speechOutput = "I'm dreadfully sorry, I didn't catch that. How would you like to prepare your meal?";
        repromptText = "You can let me know you want it rare, medium rare, medium, medium well, or well done.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getTemperature(meatType,meatID,rarity,session) {
    console.log("trying to determine temperature for " +meatType+ ' and rarity ' + rarity);
    var flavorSelection = Math.floor(Math.random()*4);
    if(rarity === -1){
        speechOutput = "Since you are cooking " + meatType + " you will want it served at " + 
            meatObject[meatID].rarityTemps[0] + " degrees " + flavorStatements[flavorSelection].flavor;
        console.log(speechOutput);
    }
    else{
        rarityLevel = getRarityLevel(rarity);
        console.log("trying to determine temperature for rarity level " + rarityLevel);
        speechOutput = "Since you are cooking " + rarity + " " + meatType + 
        " you will want it served at " + meatObject[meatID].rarityTemps[rarityLevel]  + 
        " degrees " + flavorStatements[flavorSelection].flavor;
    }
    return speechOutput;
}

function getRarityLevel(rarity){
    rarityLevels = ["RARE", "MEDIUM RARE", "MEDIUM", "MEDIUM WELL", "WELL", "WELL DONE"];
    for(x=0; x<rarityLevels.length; x++)
    {
        console.log(rarityLevels[x]);
        if (rarity.toUpperCase().localeCompare(rarityLevels[x])===0)
        {
            if (x==5){
                return 4;
            }
            return x;
        }     
    }
    return -1;
}

function buildMeatTypeAttributes(meatType,meatID){
    return{
        meatType: meatType,
        meatID: meatID
    };
}

function buildRarityAttributes(rarity) {
    return {
        rarityType: rarity
    };
}
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    console.log("Alexa says " + output);
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}