// variables
var  systems =  [] ;

// 子要素を調べる、子要素がtext内にキーワード持てば、子要素をもつ場合は、その子要素を調べる
//);
  var initFlg = false
  function setup() {
    var hoge = setInterval(function() {
      //ここで3秒ぐらい待つには？
      ["おっぱい", "オッパイ"].forEach(function (value, index, context) {
        $("body").find(':contains('+value+')').not("script").each(function(){
          var list = $(this).contents().filter(function() {
                      if(this.nodeType === 3){
                          if($.trim(this.data).length > 0 ){
                              console.log(this.data);
                              return true;
                          }
                        }
                        return false;
                    });

          $.each(list,function(index,val){
            var txt = $(this).text();
            var reg = new RegExp(value, "ig");
            $(this).parent().html(txt.replace(reg,'<span style="color:red" class="sp">'+ value +'</span>'));
          });

        });
      });

      canvas = createCanvas( $(document).width(), $(document).height());//表示領域の大きさ
      canvas.position(0, 0);
      $("#defaultCanvas").css("pointer-events","none")
      //全体の透明度
      canvas.drawingContext.globalAlpha =0.5
      frameRate(20);//秒間のフレーム数　あまり大きすぎすとパソコンが唸るよ
      smooth();//アンチエイリアス

      // 位置がJSのによって変わるっぽいのでsleepしたほうが良さそう
      //  systems.add(new ParticleSystem(1, new PVector(mouseX, mouseY)));
      $(".sp").each(function(obj){
        if($(this).offset().left > 0 && $(this).offset().top > 0 ){
          console.log($(this).offset());

          systems.push(new ParticleSystem($(this).offset().left, $(this).offset().top));
        }

      });

      initFlg =true;
      if (initFlg) {
        clearInterval(hoge);
      }
    },500);
  }

  function draw() {
    //背景色の塗りつぶしではなく、全表示をリセット。これで透明を表示できる
    clear();

    var len =  systems.length;
    for (var i = 0; i < len; i++) {
      ps= systems[i];
      ps.run();
      ps.addParticle();
    }

    if (systems.length === 0) {
      fill(255);
    }
  }


  function ParticleSystem(x, y) {
    this.particles = [];
    this.origin =[x, y];

    this.run = function() {
      for (var i = this.particles.length-1; i >= 0; i--) {
        var p = this.particles[i];
        //console.log(p);
        p.run();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }
    };


    this.addParticle= function() {
      var p;
      var nx = this.origin[0] - $( window ).scrollLeft()/512;
      var ny = this.origin[1] - $( window ).scrollTop()/512;

      p = new Particle(nx, ny);

      this.particles.push(p);
    };


    // A method to test if the particle system still has particles
    this.dead =function() {
      return this.particles.length === 0;
    };

  }

  function Particle(x, y) {
    // tmp location
    this.location=[x, y];
    this.velocity=[random(-1,1), random(-1,1)];//2 dimension array
    //this.acceleration = [ (this.velocity[0] * 0.02) , (this.velocity.[1] * 0.02) ]; //2 dimension array
    this.a = this.velocity[0] * 0.1;
    this.b = this.velocity[1] * 0.1;
    this.acceleration = [ this.a , this.b ]; //2 dimension array

    this.lifespan =255.0;
    this.color = [random(255), random(255), random(255)];

    this.run = function() {
      this.update();
      this.display();
    };

    // Method to update location
    this.update = function() {
      this.velocity[0] +=this.acceleration[0];
      this.velocity[1] +=this.acceleration[1];
      this.location[0] +=this.velocity[0];
      this.location[1] +=this.velocity[1];
      this.lifespan -= 5.0;
    };

    // Method to display
    this.display = function() {
      stroke(0,0,0,0);
      fill(this.color[0], this.color[1], this.color[2], this.lifespan);
      ellipse(this.location[0], this.location[1],8,8);
    }

    // Is the particle still useful?
    this.isDead = function() {
      return (this.lifespan < 0.0);
    }
  }
