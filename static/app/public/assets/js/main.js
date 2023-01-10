const $game= $('#game');
const Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Common = Matter.Common,
Composite = Matter.Composite,
Vertices = Matter.Vertices,
Bodies = Matter.Bodies,
Events = Matter.Events,
Svg = Matter.Svg;



const engine = Engine.create(),   
world = engine.world;

const BLOCKS_CATEGORY = { "BLOCK" : "BLOCK" , "BAR" : "BAR" , "SPECIAL" : "SPECIAL"};
const BLOCKS_TYPE = { "BLOCK" : [ "SQUARE" , "CIRCLE" , "TRAPEZOID" , "TRIANGLE" , "POLYGON" , "HEXAGON" , "HALFCIRCLE"] , "BAR" : [ "WALL3" , , "WALL5" , "PLUS"  ] , "SPECIAL" : ["HEART" , "PUZZLE" , 'STAR', 'DOM']};
const COLORS_CODE = {"RED" : "red" ,"BLUE" : "blue","GREEN" : "green" ,"YELLOW" : "yellow","BLACK" : "black","WHITE" : "white"};
const COLORS = [COLORS_CODE.RED , COLORS_CODE.BLUE , COLORS_CODE.GREEN , COLORS_CODE.YELLOW, COLORS_CODE.BLACK, COLORS_CODE.WHITE];

const forgeData = [{"category" : BLOCKS_CATEGORY.BLOCK , "count" : 15 } , {"category" : BLOCKS_CATEGORY.BAR , "count" : 5 } , {"category" : BLOCKS_CATEGORY.SPECIAL , "count" : 2 }];

let gameForgeData ={};
for (let index = 0;index < forgeData.length;index++) {
  gameForgeData[forgeData[index].category] =  {"cart" : forgeData[index].count , "total" : forgeData[index].count}
}

$( document ).ready(function() {
  initGame();  
});


