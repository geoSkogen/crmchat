// Talisma(tm) is a trademark and service mark of Talisma Corp. Copyright(c) 1998-2001 Talisma Corporation Pvt. Ltd. and its licensors. All rights reserved. -->

//************************************************************Configurations************************************************************//
var ChatWindow_Height = 450;
var ChatWindow_Width = 370;
var TL_MediaURL = "https://crm.pdx.edu/Media"; // Media chat server URL
var TL_WebtrackURL = "https://crm.pdx.edu/Webtrak"; // Webtrak server URL
var TL_ChatTitle = "Undergraduate Admissions";
var TL_EstimateBtnId = "btnEstimate";
var TL_StartChatBrnId = "btnStart";
var TL_MsgFormId = "sample";
var TL_LaunchInSamePage = false;
var chatFromRight = "20";
var sFont = "font-family:Verdana,Arial,sans-serif;font-size:.8em;";
var sColor = "background: #3498db;color: #ffffff;";
var BrowserInformation = function () {

    var document = this.document;
    var window = document.window = this;

    var parse = function (ua, platform) {
        ua = ua.toLowerCase();
        platform = (platform ? platform.toLowerCase() : '');

        // chrome is included in the edge UA, so need to check for edge first,
        // before checking if it's chrome.
        var UA = ua.match(/(edge)[\s\/:]([\w\d\.]+)/);
        if (!UA) {
            UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
        }

        if (UA[1] == 'trident') {
            UA[1] = 'ie';
            if (UA[4]) UA[2] = UA[4];
        } else if (UA[1] == 'crios') {
            UA[1] = 'chrome';
        }

        platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || ua.match(/mac|win|linux/) || ['other'])[0];
        if (platform == 'win') platform = 'windows';

        return {
            extend: Function.prototype.extend,
            name: (UA[1] == 'version') ? UA[3] : UA[1],
            version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
            platform: platform
        };
    };

    var Browser = this.Browser = parse(navigator.userAgent, navigator.platform);

    if (Browser.name == 'ie' && document.documentMode) {
        Browser.version = document.documentMode;
    }



    //<1.4compat>
    Browser[Browser.name] = true;
    Browser[Browser.name + parseInt(Browser.version, 10)] = true;

    if (Browser.name == 'ie' && Browser.version >= '11') {
        delete Browser.ie;
    }

    var platform = Browser.platform;
    if (platform == 'windows') {
        platform = 'win';
    }
    Browser.Platform = {
        name: platform
    };
    Browser.Platform[platform] = true;

    /*<ltIE9>*/
    if (this.attachEvent && !this.addEventListener) {
        var unloadEvent = function () {
            this.detachEvent('onunload', unloadEvent);
            document.head = document.html = document.window = null;
            window = this.Window = document = null;
        };
        this.attachEvent('onunload', unloadEvent);
    }

    // IE fails on collections and <select>.options (refers to <select>)
    var arrayFrom = Array.from;
    try {
        arrayFrom(document.html.childNodes);
    } catch (e) {
        Array.from = function (item) {
            if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array') {
                var i = item.length, array = new Array(i);
                while (i--) array[i] = item[i];
                return array;
            }
            return arrayFrom(item);
        };

        var prototype = Array.prototype,
            slice = prototype.slice;
    }
    /*</ltIE9>*/

    //<1.2compat>

    if (Browser.Platform.ios) Browser.Platform.ipod = true;

    Browser.Engine = {};

    var setEngine = function (name, version) {
        Browser.Engine.name = name;
        Browser.Engine[name + version] = true;
        Browser.Engine.version = version;
    };

    if (Browser.ie) {
        Browser.Engine.trident = true;

        switch (Browser.version) {
            case 6: setEngine('trident', 4); break;
            case 7: setEngine('trident', 5); break;
            case 8: setEngine('trident', 6);
        }
    }

    if (Browser.firefox) {
        Browser.Engine.gecko = true;

        if (Browser.version >= 3) setEngine('gecko', 19);
        else setEngine('gecko', 18);
    }

    if (Browser.safari || Browser.chrome) {
        Browser.Engine.webkit = true;

        switch (Browser.version) {
            case 2: setEngine('webkit', 419); break;
            case 3: setEngine('webkit', 420); break;
            case 4: setEngine('webkit', 525);
        }
    }

    if (Browser.opera) {
        Browser.Engine.presto = true;

        if (Browser.version >= 9.6) setEngine('presto', 960);
        else if (Browser.version >= 9.5) setEngine('presto', 950);
        else setEngine('presto', 925);
    }

    if (Browser.name == 'unknown') {
        switch ((navigator.userAgent.toLowerCase().match(/(?:webkit|khtml|gecko)/) || [])[0]) {
            case 'webkit':
            case 'khtml':
                Browser.Engine.webkit = true;
                break;
            case 'gecko':
                Browser.Engine.gecko = true;
        }
    }

    this.$exec = Browser.exec;

    //</1.2compat>

};
var TL_ValidationBeforeSubmit = function () {
    var Email = document.getElementById("Email");
    var theEmail = '';
    if (Email && Email.value != '') {
        theEmail = GetTrimmedString(Email.value);
        Email.value = theEmail;
    }

    if (theEmail.length > 0) {
        if (!VerifyEmail(theEmail)) {
            alert("Please enter a Valid Email ID");
            Email.focus();
            return false;
        }
    }
    return true;
}

//For Proactive Chat Start----------------------------
var TL_Proactive = false;
var TL_CheckChatInterval = 7;
var TL_ConsiderForWebtrakAfter = 10;
var TL_ProactiveMsgBoxTitle = "Talisma Chat";
var TL_GetSiteVisitorData = function () {
    BrowserInformation();
    var svFormValue = [];
    svFormValue.tName = null;
    svFormValue.tEmail = null;
    svFormValue.bIgnoreCust = null;
    svFormValue.tURL = window.parent.location.href;
    svFormValue.tIPAddress = '';
    svFormValue.tBrowser = Browser.name + " " + Browser.version;
    svFormValue.nCartValue = null;
    svFormValue.tReferrer = null;
    svFormValue.nFormSubmit = null;
    svFormValue.tDemo = null;
    svFormValue.nDemoClicked = null;
    svFormValue.tBannerAd = null;
    svFormValue.nBannerAdClicked = null;
    svFormValue.tDownloadedFiles = null
    svFormValue.tSurvey = null;
    return svFormValue;
}
//For Proactive Chat End------------------------------
//************************************************************Configurations************************************************************//
var CheckChatStop = true;
var StartImage = new Image();
StartImage.width = 0;
StartImage.height = 0;
var DefImage = new Image();
DefImage.width = 0;
DefImage.height = 0;
var sContextProps = "";
var CheckChatInterval = 0;

var onReadyChangeFunc = function () {
    if (document.readyState == "complete" || document.readyState == "loaded") {
        LoadStyle();
        if (typeof document.getElementById(TL_MsgFormId) != 'undefined') {
            document.getElementById(TL_MsgFormId).setAttribute("method", "POST");
            document.getElementById(TL_MsgFormId).setAttribute("target", "chat");
            document.getElementById(TL_MsgFormId).setAttribute("action", "about:blank");
        }
        if (TL_EstimateBtnId != "" && typeof document.getElementById(TL_EstimateBtnId) != 'undefined') {
            document.getElementById(TL_EstimateBtnId).onclick = function () {
                EstimateTime();
            };
        }
        if (TL_StartChatBrnId != "" && typeof document.getElementById(TL_StartChatBrnId) != 'undefined') {
            document.getElementById(TL_StartChatBrnId).onclick = function () {
                OpenChat(false);
            };
        }
        if (TL_Proactive == true) {
            if (TL_StartChatBrnId != "" && typeof document.getElementById(TL_StartChatBrnId) != 'undefined')
                document.getElementById(TL_StartChatBrnId).style.display = "none";
            if (typeof document.getElementById(TL_MsgFormId) != 'undefined') {
                if (document.getElementsByName("Auto").length == 0) {
                    var cntrlAuto = document.createElement("input");
                    cntrlAuto.setAttribute("name", "Auto");
                    cntrlAuto.setAttribute("id", "Auto");
                    cntrlAuto.setAttribute("type", "hidden");
                    document.getElementById(TL_MsgFormId).appendChild(cntrlAuto);
                }
                document.getElementsByName("Auto")[0].value = "Yes";
                document.getElementsByName("Auto")[0].setAttribute("value", "Yes");
                StartChecking();
                CheckChatStop = false;
            }
        }
    }
}

if(typeof document.readystatechange  != 'undefined' )
    document.readystatechange  = onReadyChangeFunc;
else{
    document.addEventListener("DOMContentLoaded",onReadyChangeFunc);
}

//******** Same page Chat Window UI Start

function LoadStyle() {
    var cStyle = document.createElement("style");
    cStyle.type = "text/css";
    var strStyle = ".chat-frame {width: " + ChatWindow_Width + "px;border: 0px none;}";
    strStyle += ".bordert{box-shadow:5px 5px 3px rgba(38, 35, 35, 0.58);border:1px solid rgba(38, 35, 35, 0.30);}";
    strStyle += ".chat-frame>div{float:left;}";
    strStyle += "html{" + sFont + "}";
    strStyle += ".transitions{-webkit-transition: all 0.2s ease-in-out 0.2s;-moz-transition: all 0.2s ease-in-out 0.2s;-o-transition: all 0.2s ease-in-out 0.2s;-ms-transition: all 0.2s ease-in-out 0.2s;transition: all 0.2s ease-in-out 0.2s;}";
    strStyle += ".chat-frame iframe {width: 100%;height: 100%;border: 0px none;}";
    strStyle += ".chat-title {height:30px;width:100%;line-height:25px;cursor:pointer;}";
    strStyle += ".chat-title > div {float:right;}";
    strStyle += ".chat-title > span {float:left;margin:2px 5px;font-weight: bold;}";
    strStyle += ".close{ display: block;cursor: pointer;float: right;height: 30px;width: 33px;font-size: 15px !important;line-height: 28px;text-align: center;box-shadow: -1px 0 0px 0 rgba(0, 0, 0, 0.2); }";
    strStyle += ".close:hover {background-color: #ffffff;color: #505050;}";
    strStyle += ".chat-body {width:100%;height: " + (ChatWindow_Height - 30) + "px;}";
    strStyle += "button{text-align:center;padding-left:22px;display: inline-block;width:25px;height:20px;line-height:11px;margin:5px 3px;}";
    strStyle += "button:before{width: 1em;text-align: center;margin-left:-1em;margin-top:1em;pointer-events: none;background:none;background-color:none;}";
    strStyle += "button:hover{Box-shadow: 0 0 2px 3px rgba(0, 0, 0, 0.5);}";
    strStyle += ".absolutes {position: fixed;right: "+ chatFromRight +"px;bottom: 0px;}";
    strStyle += ".bgcolor {"+ sColor +";text-decoration: none;}";
    strStyle += ".btn{padding: 5px 10px 5px 10px;margin:4px;height:31px;width:90px;}";
    strStyle += ".btn:hover {text-shadow: 0 0 15px #000000;}";
    if (cStyle.styleSheet)
        cStyle.styleSheet.cssText = strStyle;
    else
        cStyle.innerHTML = strStyle;
    document.body.appendChild(cStyle);
}


function LoadChatUI() {
    var frameDiv = document.createElement("div");
    frameDiv.setAttribute("id", "chat-frame");
    frameDiv.setAttribute("class", "chat-frame absolutes bordert");
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "chat-title bgcolor");
    titleDiv.innerHTML = "<span>" + TL_ChatTitle + "</span>";
    titleDiv.setAttribute("onclick", "minimizeMe()");
    var cBtn = document.createElement("i");
    cBtn.className = "close";
    cBtn.setAttribute("onclick", "closeMe('chat-frame')");
    cBtn.innerHTML = "✖";
    cBtn.setAttribute("class", "close");
    var bDiv = document.createElement("div");
    bDiv.appendChild(cBtn);
    titleDiv.appendChild(bDiv);
    var bodyDiv = document.createElement("div");
    bodyDiv.setAttribute("class", "chat-body transitions");
    bodyDiv.setAttribute("id", "chat-body");
    bodyDiv.innerHTML = '<iframe id="fChat" src="" name="chat" ></iframe></div>';
    frameDiv.appendChild(titleDiv);
    frameDiv.appendChild(bodyDiv);
    document.body.appendChild(frameDiv);
    var frmeHeight = document.getElementById("chat-frame").offsetHeight;
    document.getElementById("chat-body").style.height = (frmeHeight - 30) + "px";
}

function minimizeMe() {
    if (document.getElementById("chat-body")) {
        if (document.getElementById("chat-body").style.height == "0px")
            document.getElementById("chat-body").style.height = (ChatWindow_Height - 30) + "px";
        else
            document.getElementById("chat-body").style.height = 0 + "px";
    }
}
function closeMe(id) {
    if (document.getElementById(id)) {
        var chatFrame = document.getElementById(id);
        document.body.removeChild(chatFrame);
    }
}

//******** Same page Chat Window UI End
function ran() {
    return Math.floor(10000 * Math.random());
}

function LaunchAlert(option) {
    option.oklabel = (typeof option.oklabel != 'undefined') ? option.oklabel : "Ok";
    option.cencellabel = (typeof option.cencellabel != 'undefined') ? option.cencellabel : "Cancel";
    option.promsg = (typeof option.promsg != 'undefined') ? option.promsg : "Our customer service representative will come online to assist you. Please wait...";
    var popUpDiv = top.document.createElement("div");
    popUpDiv.setAttribute("id", "NewPopup");
    popUpDiv.className = "transitions bordert";
    popUpDiv.style.backgroundColor = "white";
    //popUpDiv.style.boxShadow = "0px 0px 0px 10px rgba(255,255,255,0.1);";
    popUpDiv.style.padding = "1px";
    popUpDiv.style.position = "absolute";
    popUpDiv.style.width = "0";
    popUpDiv.style.height = "0";
    popUpDiv.style.left = "-100px";
    popUpDiv.style.top= "-100px";
    var okButton = top.document.createElement("input");
    okButton.setAttribute("type", "button");
    okButton.className = "btn bgcolor"
    okButton.value = option.oklabel;
    okButton.style.cssFloat = "right";
    okButton.onclick = function () {
        if (typeof option.onok != 'undefined') {
            option.onok(function () {
                top.document.body.removeChild(popUpDiv);
            });
        }
    };
    var cancelButton = top.document.createElement("input");
    cancelButton.value = option.cencellabel;
    cancelButton.setAttribute("type", "button");
    cancelButton.className = "btn bgcolor"
    cancelButton.style.cssFloat = "right";
    cancelButton.style.marginLeft = "5px";
    cancelButton.onclick = function () {
        if (typeof option.oncancel != 'undefined') {
            option.oncancel(function () {
                top.document.body.removeChild(popUpDiv);
            });
        }
    };
    var titleDiv = top.document.createElement("div");
    titleDiv.innerHTML = "<span>" + TL_ProactiveMsgBoxTitle + "</span><div><i onclick='closeMe(\"NewPopup\");' class='close'>✖</i></div>";
    titleDiv.className = "bgcolor chat-title";
    var Message = top.document.createElement("div");
    Message.innerHTML = option.promsg;
    //Message.style.width = "100%";
    Message.style.height = "70px";
    Message.style.padding = "5px";
    if(Message.style.borderBottom)
        Message.style.borderBottom = "1px solid rgba(38, 35, 35, 0.20)";
    var buttons = top.document.createElement("div");
    buttons.style.cssFloat = "right";
    buttons.appendChild(cancelButton);
    buttons.appendChild(okButton);
    popUpDiv.appendChild(titleDiv);
    popUpDiv.appendChild(Message);
    popUpDiv.appendChild(buttons);
    top.document.body.appendChild(popUpDiv);
    setTimeout(function () {
        var popUpDiv = document.getElementById("NewPopup");
        popUpDiv.style.width = "300px";
        popUpDiv.style.height = "150px";
        popUpDiv.style.left = "40%";
        popUpDiv.style.top = "20%";
    },1000);
}


// This function will be called when visitor visits proactive chat page first time to insert a row in site visitor
function StartCheck() {
    var svFormValue = TL_GetSiteVisitorData();
    var re = / /g;
    svFormValue.tBrowser = svFormValue.tBrowser.replace(re, "%20");

    // Pass possible values on any/all of below fields for updation on webtrak DB while visitor visits Chat Page
    QryStr = ((svFormValue.tName == null || svFormValue.tName == "" || svFormValue.tName == "undefined") ? "" : ("&tName=" + escape(svFormValue.tName))) +
		((svFormValue.tEmail == null || svFormValue.tEmail == "" || svFormValue.tEmail == "undefined") ? "" : ("&tEmail=" + escape(svFormValue.tEmail))) +
		((svFormValue.bIgnoreCust == null || svFormValue.bIgnoreCust == "" || svFormValue.bIgnoreCust == "undefined") ? "" : ("&bIgnoreCust=" + escape(svFormValue.bIgnoreCust))) +
		((svFormValue.tURL == null || svFormValue.tURL == "" || svFormValue.tURL == "undefined") ? "" : ("&tURL=" + escape(svFormValue.tURL))) +
		((svFormValue.tIPAddress == null || svFormValue.tIPAddress == "" || svFormValue.tIPAddress == "undefined") ? "" : ("&tIPAddress=" + escape(svFormValue.tIPAddress))) +
		((svFormValue.tBrowser == null || svFormValue.tBrowser == "" || svFormValue.tBrowser == "undefined") ? "" : ("&tBrowser=" + escape(svFormValue.tBrowser))) +
		((svFormValue.nCartValue == null || svFormValue.nCartValue == "" || svFormValue.nCartValue == "undefined") ? "" : ("&nCartValue=" + escape(svFormValue.nCartValue))) +
		((svFormValue.tReferrer == null || svFormValue.tReferrer == "" || svFormValue.tReferrer == "undefined") ? "" : ("&tReferrer=" + escape(svFormValue.tReferrer))) +
		((svFormValue.nFormSubmit == null || svFormValue.nFormSubmit == "" || svFormValue.nFormSubmit == "undefined") ? "" : ("&nFormSubmit=" + escape(svFormValue.nFormSubmit))) +
		((svFormValue.tDemo == null || svFormValue.tDemo == "" || svFormValue.tDemo == "undefined") ? "" : ("&tDemo=" + escape(svFormValue.tDemo))) +
		((svFormValue.nDemoClicked == null || svFormValue.nDemoClicked == "" || svFormValue.nDemoClicked == "undefined") ? "" : ("&nDemoClicked=" + escape(svFormValue.nDemoClicked))) +
		((svFormValue.tBannerAd == null || svFormValue.tBannerAd == "" || svFormValue.tBannerAd == "undefined") ? "" : ("&tBannerAd=" + escape(svFormValue.tBannerAd))) +
		((svFormValue.nBannerAdClicked == null || svFormValue.nBannerAdClicked == "" || svFormValue.nBannerAdClicked == "undefined") ? "" : ("&nBannerAdClicked=" + escape(svFormValue.nBannerAdClicked))) +
		((svFormValue.tDownloadedFiles == null || svFormValue.tDownloadedFiles == "" || svFormValue.tDownloadedFiles == "undefined") ? "" : ("&tDownloadedFiles=" + escape(svFormValue.tDownloadedFiles))) +
		((svFormValue.tSurvey == null || svFormValue.tSurvey == "" || svFormValue.tSurvey == "undefined") ? "" : ("&tSurvey=" + escape(svFormValue.tSurvey)));

    strsrc = TL_WebtrackURL + "/Webtrak.aspx?Fn=Start&SetCookie=True" + QryStr + "&num=" + ran();
    StartImage.src = strsrc;
    CheckChatInterval = window.setInterval("CheckOnTime()", TL_CheckChatInterval * 1000);
}

// This function will be called to start Proactive ChatSession
function StartChatSession(sAuto) {
    var strurl = "";
    if (sAuto != true) {
        return false;
    }
    if (CheckChatInterval != 0) {
        CheckChatStop = true;
        window.clearInterval(CheckChatInterval);
    }
    if (TL_MediaURL.length > 0) {
        CreateChatNow(true);
    }
    return true;
}


// This function will in loop to check if agent has sent invitation or not
function CheckOnTime() {
    var cHeight = 0;
    var cWidth = 0;
    if (StartImage.naturalHeight) {
        cHeight = StartImage.naturalHeight;
        cWidth = StartImage.naturalWidth;
    }
    else {
        cHeight = StartImage.height;
        cWidth = StartImage.width;
    }
    // StartImage Height/width will be 1 if BeginTrakUrlStar succceeds
    if (CheckChatStop == true || cHeight != 1 || cWidth != 1)
        return;

    if (DefImage.naturalHeight) {
        cHeight = DefImage.naturalHeight;
        cWidth = DefImage.naturalWidth;
    }
    else {
        cHeight = DefImage.height;
        cWidth = DefImage.width;
    }
    // DefImage Height/width will be 1 if BeginTrakUrlEnd succceeds (user sends invitation to visitor)
    if (cHeight != 1 || cWidth != 1) {
        var strsrc = TL_WebtrackURL + "/Webtrak.aspx?fn=CheckChat&num=" + ran();
        DefImage.src = strsrc;
        return;
    }
    else {
        StartChatSession(true);
    }
}

// This function will be called to get wait time and position in queue estimation for next visitor chat, Without initiating chat session.
// Output of this function will be jason - ReturnCode:0,WaitTime:0,Position:0
// One can pass any of below fields using form post for exact estimation:
// CurURL - For Current URL.
// CaseID - For Case Id.
// TeamID - For Team Id.
// MediaID - For MediaId.
function EstimateTime() {
    var strurl = "";
    var retValue = "False";
    var querystr = TL_MediaURL + "/ChatActions/ChatAction.ashx";

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", querystr, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.send("doCheck=1&CurURL=" + top.window.location.href + "&CaseID=0&TeamID=0&MediaID=6&Email=pravat@this.com&Auto=join&Name=pravat");
    alert(xmlHttp.responseText);
    //eval("var result = " + xmlHttp.responseText); // User result variable to initialize result json
    //alert(result.WaitTime); // result.ReturnCode,result.WaitTime,result.Position can be used for values

    if (xmlHttp.responseText != '') {
        return xmlHttp.responseText;
    }
    return true;
}

// This function will be called when visitor visits Proactive chat page
function StartChecking() {
    window.setTimeout("StartCheck()", TL_ConsiderForWebtrakAfter * 1000); // Change this interval for the delay to show sitevisitor row at agent side.
    return;
}

// To trim String values
function GetTrimmedString(sel) {
    var tmpStr = "";
    var startPos = 0;
    var endPos = sel.length;

    for (i = 0; i < sel.length; i++) {
        if ((escape(sel.charAt(i)) != "%0A") && (escape(sel.charAt(i)) != "%0D") && (escape(sel.charAt(i)) != "%09") && (escape(sel.charAt(i)) != "%20"))
            break;
    }
    startPos = i;

    for (i = sel.length - 1; i > -1; i--) {
        if ((escape(sel.charAt(i)) != "%0A") && (escape(sel.charAt(i)) != "%0D") && (escape(sel.charAt(i)) != "%09") && (escape(sel.charAt(i)) != "%20"))
            break;
    }
    endPos = i + 1;

    for (j = startPos; j < endPos; j++)
        tmpStr += sel.charAt(j);
    return (tmpStr);
}



// To initiate Proactive chat confirmation dialoge
function CreateChatNow() {
    var onok = function (closefunc) {
        InitiateChat(true);
        closefunc();
    }
    var oncancel = function (closefunc) {
        DenyProactive();
        closefunc();
    }
    LaunchAlert({ onok: onok, oncancel: oncancel });
}

// To deny proactive request
function DenyProactive() {
    var querystr = TL_MediaURL + "/ChatActions/ChatAction.ashx?ProactiveDeny=REMOVEPROACTIVE";
    DefImage.src = querystr;
    return;
}

// To Initiate Proactive chat
function InitiateChat(proactive) {
    OpenChat(proactive);
}

// To initiate Chat (Proactive/reactive)
function OpenChat(proactive) {
    if (TL_ValidationBeforeSubmit() == true) {
        if (TL_LaunchInSamePage == true && document.getElementById("chat-frame") == null) {
            LoadStyle();
            LoadChatUI();
        }
        else {
            var win = window.open("about:blank", "chat", "height=" + ChatWindow_Height + ", width = " + ChatWindow_Width);
        }
        var url = TL_MediaURL + "/VisitorChat/StartChat.aspx";
        var form = document.getElementById(TL_MsgFormId);
        form.action = url;
        form.submit();
    }
}


// Validation of email format
function VerifyEmail(sel) {
    pos = sel.indexOf("@");
    pos2 = sel.lastIndexOf("@");
    if (pos != pos2) return false;
    pos1 = sel.lastIndexOf(".");
    if (pos == -1 || pos1 == -1 || pos1 <= pos || sel.indexOf(" ") != -1) {
        return false;
    }
    sel1 = sel.substr(pos + 1);
    var RegPat = "[`~!#$%^&*)(_+=}{|\[:;\"'><,?/]";
    var emailReg = new RegExp(RegPat, "g");
    if (emailReg.test(sel1) || sel1.indexOf('\\') > 0 || sel1.indexOf(']') > 0) return false;

    sel2 = sel.substr(0, pos);
    var RegPat = "[><)(\[,;:\"]";
    var emailReg = new RegExp(RegPat, "g");
    if (emailReg.test(sel2) || sel2.indexOf('\\') > 0 || sel2.indexOf(']') > 0) return false;

    pos2 = 0;
    while (sel1.indexOf(".") != -1) {
        pos2 = sel1.indexOf(".");
        if (pos2 == -1) pos2 = sel1.length;
        temp = sel1.substr(0, pos2);
        if (temp == "") return false;
        sel1 = sel1.substr(pos2 + 1);
    }
    if (sel1 == "") return false;
    pos2 = 0;
    while (sel2.indexOf(".") != -1) {
        pos2 = sel2.indexOf(".");
        if (pos2 == -1) pos2 = sel2.length;
        temp = sel2.substr(0, pos2);
        if (temp == "") return false;
        sel2 = sel2.substr(pos2 + 1);
    }
    if (sel2 == "") return false;
    return true;
}