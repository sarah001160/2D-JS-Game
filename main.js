// 教學影片 https://www.youtube.com/watch?v=0qtg-9M3peI&list=PLMc444KH_NezuJZIls4sIR6n0HuZiFclP
// main.js 是主要的設定檔案(入口) 去看 index.html，就只有匯入 main.js 這隻檔案
import './style.css'
import Phaser from 'phaser' // 匯入套件 for 動畫

const sizes = {
  width: 500,
  height: 500
}

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game")
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");

  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0);
    this.player.setImmovable(true); // 可動
    this.player.body.allowGravity = false; // 但不給重力
    this.player.setCollideWorldBounds(true); // 不讓它跑出畫框外
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6).
      setOffset(this.player.width / 10, this.player.height - this.player.height / 10);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown); // 設定掉落速度

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arail",
      fill: "#000000",
    });

    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arail",
      fill: "#000000",
    })

  }

  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0); // 設定高度0
      this.target.setX(this.getRandomX()) // 設定寬度、由函數getRandomX控制
    }


    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0)
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480); // 回傳 0 < ~ < 1之間的亂數乘上480
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

}

// 設定參數
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    }
  },
  scene: [GameScene] // 使用這個class函數
}




const game = new Phaser.Game(config);



