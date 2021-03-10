function Game(gameContainerId, data) {
    this.activeScene = document.getElementById(gameContainerId);
    this.steps = new CheckPoits();
    this.data = data || {};
    this.users = data.rating || [];
    this.friendsList = new FriendList(data.friends);

    this.build = function () {
        if (this.activeScene instanceof HTMLElement) {
            this.character = new Character(this.steps);
            this.character.addTo(this.activeScene);
            this.friends = new Container();
            this.navigation = new Container();
            this.navigation.addClass("navigation").addTo(this.activeScene);
            this.navigation.addItem(this.friends.addClass("friends nav-item"));
            this.navigation.addItem(
                new GameObject().addClass("chat-button nav-item")
            );
            this.navigation.addItem(
                new GameObject()
                    .addClass("university-button nav-item")
                    .addHandler(
                        "click",
                        this.character.goToNextStep.bind(this.character)
                    )
            );
            this.navigation.addItem(
                new GameObject().addClass("email-button nav-item")
            );
            this.navigation.addItem(
                new GameObject().addClass("score-button nav-item").addHandler(
                    "click",
                    function () {
                        if (!this.modal) {
                            this.modal = new Modal();
                            this.modal.addTo(this.activeScene);
                        }
                        this.modal.showMessage(
                            "Рейтинг игроков",
                            new ScoreTable(this.data).outerHTML()
                        );
                    },
                    this
                )
            );
            this.slider = new Slider().addClass("slider");
            this.friends
                .addItem(
                    new GameObject()
                        .addClass("back-button")
                        .addHandler(
                            "click",
                            this.slider.slideBack.bind(this.slider)
                        )
                )
                .addItem(this.slider)
                .addItem(
                    new GameObject()
                        .addClass("forw-button")
                        .addHandler(
                            "click",
                            this.slider.slideForw.bind(this.slider)
                        )
                );
            this.slider.addItem(
                new GameObject()
                    .addClass("slider-item friend add-friend-button")
                    .html(
                        `<img title="Add new friend" src="${this.friendsList.noImage}">`
                    )
            );
            const myFriends = this.friendsList.getFriends();

            myFriends.forEach((friend) => {
                const img = friend.img || this.friendsList.noImage;
                const className = `slider-item friend ${
                    friend.img ? "" : "no-image"
                }`;
                this.slider.addItem(
                    new GameObject()
                        .addClass(className)
                        .html(`<img  title="${friend.name}" src="${img}">`)
                );
            });
        }

        return this;
    };

    return this;
}

function Character(steps) {
    Object.setPrototypeOf(this, new GameObject());

    this.obj.id = "character";
    this.isMoving = false;
    this.steps = steps;

    this.move = function (pos) {
        if (!pos || this.movenmentState()) {
            return;
        }
        this.obj.style.left = pos.x - this.obj.offsetWidth / 2 + "px";
        this.obj.style.top = pos.y - this.obj.offsetHeight + 6 + "px";
        return this;
    };

    this.goToNextStep = function () {
        if (this.isMoving) {
            return;
        }
        const next = this.steps.pos.next();
        if (next.done) {
            return;
        }
        this.move(next.value);
    };

    this.smoothMovenments = function () {
        this.obj.style.transition = "top 1s, left 1s, filter 1s";
        return this;
    };

    this.addTo = ((f) => {
        return function (sceneObj) {
            f.call(this, sceneObj);
            this.move(this.steps.pos.next().value);
            this.smoothMovenments();
        };
    })(this.addTo);

    this.movenmentState = function () {
        if (this.isMoving) {
            return true;
        }
        this.isMoving = true;
        setTimeout(() => {
            this.isMoving = false;
        }, 1000);
        return false;
    };

    return this;
}

/**
 * Container - navigation object
 */
function Container() {
    Object.setPrototypeOf(this, new GameObject());

    this.addItem = function (newItem) {
        newItem.addTo(this.obj);
        return this;
    };

    return this;
}

function GameObject(tag = "div") {
    this.obj = document.createElement(tag);
    if (!this.obj) {
        throw new Error("Cannot create GameObject. Bad tag: ", tag);
    }

    this.addTo = function (sceneObj) {
        sceneObj.appendChild(this.obj);
    };

    this.html = function (newHtml) {
        this.obj.innerHTML = newHtml;
        return this;
    };
    this.addClass = function (className) {
        this.obj.classList.add(...className.match(/[^,\s]+/g));
        return this;
    };

    this.removeClass = function (className) {
        this.obj.classList.remove(...className.match(/[^,\s]+/g));
    };

    this.addHandler = function (type, callback, context) {
        if (!(callback && typeof callback === "function") || !type) {
            throw new Error(`
    Cannot add handler. Wrong params
    Type:  ${type}
    Callback: ${callback}`);
        }
        this.obj.addEventListener(type, () => {
            callback.call(context);
        });
        return this;
    };

    return this;
}

function CheckPoits() {
    this.checkpointsPositions = function* () {
        yield* [
            { x: 444, y: 500 },
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
    const SCROLL_STEP = 60;
    Object.setPrototypeOf(this, new GameObject());
    this.tape = new Container().addClass("slider-tape");
    this.tape.addTo(this.obj);

    this.addItem = function (newItem) {
        this.tape.addItem(newItem);
    };

    this.slideForw = function () {
        this.obj.scrollLeft += SCROLL_STEP;
    };
    this.slideBack = function () {
        this.obj.scrollLeft -= SCROLL_STEP;
    };

    return this;
}

function FriendList(friends) {
    this.friends = friends || [];
    this.noImage = "images/no-photo-friend.png";
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
        setTimeout(() => this.addClass("active"));
    };

    this.close = function () {
        this.removeClass("active");
        this.header.html("");
        this.message.html("");
    };

    this.overlay = new GameObject()
        .addClass("modal-overlay")
        .addHandler("click", this.close.bind(this));
    this.closeButton = new GameObject()
        .addClass("modal-close-button")
        .addHandler("click", this.close.bind(this));

    this.body.addTo(this.obj);
    this.header.addTo(this.body.obj);
    this.message.addTo(this.body.obj);
    this.overlay.addTo(this.obj);
    this.closeButton.addTo(this.body.obj);
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
    Character,
    GameObject,
    Container,
    CheckPoits,
    Slider,
    FriendList,
    Friend,
    User,
    Modal,
    ScoreTable,
};
