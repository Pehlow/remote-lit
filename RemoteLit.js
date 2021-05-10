const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const robot = require('robotjs');

http.listen(3000, () => {
    console.log("Server running on port 3000");
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/assets/index.html');
})
app.get("/joy.js", (req, res) => {
    res.sendFile(__dirname + '/assets/joy.js');
})
app.get("/css/styles.css", (req, res) => {
    res.sendFile(__dirname + '/assets/css/styles.css');
})

io.on("connection", (socket) => {
    console.log("connected");
    robot.setMouseDelay(0)
    var mouse = robot.getMousePos();
    socket.on("disconnect", () => {
        console.log("disconnected");
    })
    socket.on("message", (data) => {
        console.log("<" + data);
    })

    socket.on("keydown", (data) => {
        console.log("keydown :" + data);
        switch (data) {
            case " ":
                robot.keyTap("space");
                break;
            case "Backspace":
                robot.keyTap("backspace");
                break;
            case "Escape":
                robot.keyTap("escape");
                break;
            case "Tab":
                robot.keyTap("tab");
                break;
            case "Delete":
                robot.keyTap("delete");
                break;  
            case "Enter":
                robot.keyTap("enter");
                break;
            default:
                robot.keyTap(data);
        }

    })

    socket.on("down", (data) => {
        console.log("down :" + data);
        robot.keyToggle(data, "down");
    });
    socket.on("up", (data) => {
        console.log("up :" + data);
        robot.keyToggle(data, "up");
    });

    socket.on("mouse", (data) => {
        var d = {
            x: parseInt(data.split('|')[0]),
            y: parseInt(data.split('|')[1]),
            s: parseInt(data.split('|')[2]) / 100
        };
        mouse = robot.getMousePos();
        /* console.log(`expected ${d.x} ${d.y} ${d.s}`); */
        robot.moveMouse(mouse.x + d.x * d.s, mouse.y - d.y * d.s);
    })

    socket.on("click", (data) => {
        console.log("click :", data)
        robot.mouseClick(data, false);
    })

    socket.on("vol", (data) => {
        if (data == "volp") {
            for (let i = 0; i < 5; i++) {
                robot.keyTap("audio_vol_up")
            }
            console.log("vol :", data)
        } else if (data == "volm") {
            for (let i = 0; i < 5; i++) {
                robot.keyTap("audio_vol_down")
            }
            console.log("vol :", data)
        } else {
            console.log("error")
        }
    })


})