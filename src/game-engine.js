function Game(gameContainerId, data) {
    const X_POS = 444;
    const Y_POS = 500;
    this.activeScene = document.getElementById(gameContainerId);
    this.data = data || {};
    this.users = data.rating || [];
    this.friendsList = new FriendList(data.friends);

    this.build = function () {
        if (this.activeScene instanceof HTMLElement) {
            this.player = new Player({ x: X_POS, y: Y_POS });
            this.player.addToScene(this.activeScene);
            this.navigation = new Navigation().addClass("navigation");
            this.navigation.addToScene(this.activeScene);
            this.friends = new Navigation().addClass("friends nav-item");
            this.navigation.addItem(this.friends);
            this.modal = new Modal();
            this.modal.addToScene(this.activeScene);
            this.navigation.addItem(
                new NavItem(
                    "click",
                    console.log.bind(null, "Clicked: chat-button")
                ).addClass("chat-button nav-item")
            );
            this.navigation.addItem(
                new NavItem(
                    "click",
                    this.player.goToNextStep.bind(this.player)
                ).addClass("university-button nav-item")
            );
            this.navigation.addItem(
                new NavItem(
                    "click",
                    console.log.bind(null, "Clicked: email-button")
                ).addClass("email-button nav-item")
            );
            this.navigation.addItem(
                new NavItem(
                    "click",
                    this.modal.showMessage.bind(
                        this.modal,
                        "Рейтинг игроков",
                        new ScoreTable(this.data).outerHTML()
                    )
                ).addClass("score-button nav-item")
            );
            this.slider = new Slider().addClass("slider");
            this.friends
                .addItem(
                    new NavItem(
                        "click",
                        this.slider.slideBack.bind(this.slider)
                    ).addClass("back-button")
                )
                .addItem(this.slider)
                .addItem(
                    new NavItem(
                        "click",
                        this.slider.slideForw.bind(this.slider)
                    ).addClass("forw-button")
                );
            this.slider.addItem(
                new NavItem(
                    "click",
                    console.log.bind(null, "Clicked: add-friend-button")
                )
                    .addClass("slider-item friend add-friend-button")
                    .html(
                        `<img title="Add new friend" src="${this.friendsList.noImage}">`
                    )
            );
            const myFriends = this.friendsList.getFriends();
            if (myFriends.length) {
                myFriends.forEach((friend) => {
                    const img = friend.img || this.friendsList.noImage;
                    let className = "slider-item friend";
                    className += friend.img ? "" : " no-image";
                    this.slider.addItem(
                        new GameObject()
                            .addClass(className)
                            .html(`<img  title="${friend.name}" src="${img}">`)
                    );
                });
            }
        }

        return this;
    };

    return this;
}

function Player(pos = { x: 0, y: 0 }) {
    Object.setPrototypeOf(this, new GameObject());
    this.steps = new CheckPoits();
    this.obj.id = "player";
    this.startPosition = pos;
    this.isMoving = false;

    this.move = function (pos) {
        if (!pos || this.movenmentState()) return;
        this.obj.style.left = pos.x - this.obj.offsetWidth / 2 + "px";
        this.obj.style.top = pos.y - this.obj.offsetHeight + 6 + "px";
        return this;
    };

    this.goToNextStep = function () {
        if (this.isMoving) return;
        const next = this.steps.pos.next();
        if (next.done) return;
        this.move(next.value);
    };

    this.smoothMovenments = function () {
        this.obj.style.transition = "top 1s, left 1s, filter 1s";
        return this;
    };

    this.sharpMovenments = function () {
        this.obj.style.transition = "initial";
        return this;
    };

    this.addToScene = ((f) => {
        return function (sceneObj) {
            f.call(this, sceneObj);
            this.move(this.startPosition);
            this.smoothMovenments();
        };
    })(this.addToScene);

    this.movenmentState = function () {
        if (this.isMoving) return true;
        this.isMoving = setTimeout(() => {
            this.isMoving = false;
        }, 1000);
        return false;
    };

    return this;
}

function GameController(type, callback) {
    Object.setPrototypeOf(this, new GameObject());

    this.addHandler = function (type, callback) {
        this.obj.addEventListener(type, callback);
        return this;
    };

    if (!type || !callback) {
        return this;
    }

    this.addHandler(type, callback);

    return this;
}
/**
 * Navigation - navigation object
 */
function Navigation() {
    Object.setPrototypeOf(this, new GameObject());

    this.addItem = function (newItem) {
        newItem.addToScene(this.obj);
        return this;
    };
    this.removeItem = function () {};

    return this;
}

function GameObject() {
    this.obj = document.createElement("div");

    this.addToScene = function (sceneObj) {
        sceneObj.appendChild(this.obj);
    };

    this.html = function (newHtml) {
        this.obj.innerHTML = newHtml;
        return this;
    };
    this.addClass = function (className) {
        if (/(\s|,)/.test(className)) {
            this.obj.classList.add(...className.match(/[^\,\s]+/g));
        } else {
            this.obj.classList.add(className);
        }
        return this;
    };

    this.removeClass = function (className) {
        if (/(\s|,)/.test(className)) {
            this.obj.classList.remove(...className.match(/[^\,\s]+/g));
        } else {
            this.obj.classList.remove(className);
        }
    };

    return this;
}

function NavItem(typeEvent, callback) {
    Object.setPrototypeOf(this, new GameController(typeEvent, callback));
    return this;
}

function CheckPoits() {
    this.checkpointsPositions = function* () {
        yield* [
            { x: 350, y: 475 },
            { x: 275, y: 518 },
            { x: 190, y: 535 },
            { x: 110, y: 508 },
            { x: 124, y: 444 },
            { x: 142, y: 388 },
            { x: 214, y: 350 },
            { x: 176, y: 280 },
            { x: 138, y: 228 },
            { x: 202, y: 198 },
            { x: 254, y: 242 },
            { x: 296, y: 204 },
            { x: 332, y: 156 },
            { x: 372, y: 110 },
            { x: 420, y: 40 },
            { x: 504, y: 78 },
            { x: 460, y: 150 },
            { x: 486, y: 224 },
            { x: 456, y: 302 },
            { x: 386, y: 346 },
            { x: 376, y: 410 },
            { x: 453, y: 426 },
            { x: 525, y: 467 },
            { x: 621, y: 500 },
            { x: 714, y: 522 },
            { x: 809, y: 468 },
            { x: 884, y: 423 },
            { x: 947, y: 382 },
            { x: 959, y: 313 },
            { x: 902, y: 286 },
            { x: 841, y: 325 },
            { x: 782, y: 360 },
            { x: 720, y: 351 },
            { x: 725, y: 298 },
            { x: 796, y: 256 },
            { x: 806, y: 187 },
            { x: 750, y: 178 },
            { x: 678, y: 214 },
            { x: 624, y: 256 },
            { x: 581, y: 304 },
            { x: 522, y: 286 },
            { x: 506, y: 229 },
            { x: 543, y: 174 },
            { x: 590, y: 141 },
            { x: 614, y: 82 },
            { x: 645, y: 31 },
            { x: 698, y: 57 },
            { x: 672, y: 138 },
            { x: 750, y: 83 },
            { x: 820, y: 136 },
            { x: 865, y: 106 },
            { x: 884, y: 172 },
        ];
    };

    this.pos = this.checkpointsPositions();
}

function Slider() {
    Object.setPrototypeOf(this, new GameObject());
    this.position = 0;
    this.range = 0;
    this.tape = new Navigation().addClass("slider-tape");
    this.tape.addToScene(this.obj);

    this.addItem = function (newItem) {
        this.tape.addItem(newItem);
        this.range = this.tape.obj.offsetWidth - this.obj.offsetWidth;
    };

    this.slideForw = function () {
        if (this.range > 0) {
            this.obj.scrollLeft += 64;
            this.position++;
        }
    };
    this.slideBack = function () {
        if (this.range > 0) {
            this.position--;
            this.obj.scrollLeft -= 64;
        }
    };

    return this;
}

function FriendList(friends) {
    this.friends = friends || [];
    this.noImage = "/images/no-photo-friend.png";
    this.addFriend = function (user) {
        this.friends[user.id] = user;
        return this;
    };

    this.removeFriend = function (userId) {
        delete this.friends[userId];
        return this;
    };

    this.getFriends = function () {
        return Object.values(this.friends);
    };
    return this;
}

function Friend(user) {
    Object.setPrototypeOf(this, new User(user));

    this.remove = function (friendList) {
        friendList.removeFriend(this.id);
    };
}

function User(userData) {
    if (userData instanceof String) userData = JSON.parse(userData);
    this.name = userData.name;
    this.id = userData.id;
    this.lastName = userData.lastName;
    this.img = userData.img;
}

function Modal() {
    Object.setPrototypeOf(this, new GameObject());

    this.addClass("modal");

    this.body = new GameObject().addClass("modal-body");
    this.header = new GameObject().addClass("modal-header");
    this.message = new GameObject().addClass("modal-message");

    this.showMessage = function (header, content) {
        this.header.html(header);
        this.message.html(content);
        this.addClass("active");
    };

    this.close = function () {
        this.removeClass("active");
        this.header.html("");
        this.message.html("");
    };

    this.overlay = new GameController("click", this.close.bind(this)).addClass(
        "modal-overlay"
    );
    this.closeButton = new GameController(
        "click",
        this.close.bind(this)
    ).addClass("modal-close-button");

    this.body.addToScene(this.obj);
    this.header.addToScene(this.body.obj);
    this.message.addToScene(this.body.obj);
    this.overlay.addToScene(this.obj);
    this.closeButton.addToScene(this.body.obj);
}

function ScoreTable(data) {
    let rating = data.rating;
    rating.sort((a, b) => b.points - a.points);
    rating = rating.slice(0, 7);

    this.table = new GameObject().addClass("score-table");
    this.tableContent = `
    <div class="score-table-item score-table-head">
        <div>Место</div>
        <div>Имя Фамилия</div>
        <div>Опыт</div>
    </div>
`;

    rating.forEach((user, i) => {
        const isFriend = data.friends.find((friend) => {
            return friend.id === user.id;
        });
        this.tableContent += `<div class="score-table-item ${
            isFriend ? "score-table-friend" : ""
        }">
            <div>
                <div>${i + 1}</div>
                <div class="designers-orange-shit">
                    ${isFriend ? "Your<br>Friend" : ""}
                </div>
            </div>
            <div>${user.name} ${user.lastName}</div>
            <div>${user.points}</div>
        </div>`;
    }, this);

    this.table.html(this.tableContent);

    this.outerHTML = function () {
        return this.table.obj.outerHTML;
    };

    return this;
}

module.exports = {
    Game,
    Player,
    GameObject,
    GameController,
    Navigation,
    NavItem,
    CheckPoits,
    Slider,
    FriendList,
    Friend,
    User,
    Modal,
    ScoreTable,
};
