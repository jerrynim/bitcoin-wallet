const electron = require("electron"),
  path = require("path"),
  url = require("url"),
  getPort = require("get-port"),
  bitcoin = require("./bitcoin/src/server");

getPort().then((port) => {
  const server = bitcoin.app.listen(port, () => {
    console.log(`Running blockchain node on: http://localhost:${port}`);
  });
  bitcoin.startP2PServer(server);
  global.sharedPort = port;
});

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: "bitcoin wallet"
  });

  const ENV = process.env.ENV;

  const template = [
    {
      label: "Nomadcoin Wallet",
      submenu: [
        {
          label: "About Nomadcoin Wallet",
          role: "about"
        },
        {
          type: "separator"
        },
        {
          label: "Services",
          role: "services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          label: "Hide Nomadcoin Wallet",
          accelerator: "Command+H",
          role: "hide"
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          role: "hideothers"
        },
        {
          label: "Show All",
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          role: "undo"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          role: "redo"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          role: "cut"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          role: "copy"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          role: "paste"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          role: "selectall"
        }
      ]
    }
  ];

  if (ENV === "dev") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "build/index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  //window가 종료됬을때
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  } //darwin 은 macos
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } //맥에서 닫혀있는 아이콘 클릭시
});

app.on("ready", createWindow);
