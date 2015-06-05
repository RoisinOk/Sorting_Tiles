/**
 * Created by roisinokeeffe on 05/06/2015.
 */

//this selects the list div which contains the tiles
var $list = $("#list1");

//The shadows refer to the values of the box shadow on the tiles
//shadow1 is the normal shadow
//shadow2 is the bigger shadow for when they are being moved
var shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
var shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";
//The Label is the number of the tile as it is created. It increased with each tile.
var label = 1;
//The z-index property specifies the stack order of an element. Bigger numbers are closer.
var zIndex = 1000;

//=====================================================================================
    //CREATE A TILE
//=====================================================================================

//The addTile function appends another tile to the list div.
function addTile(){
    //This declares a new div element with a class of tile, and gives it a HTML label of a number.
    //Then the new element is appended to the list div.
    var element = $("<div></div>").addClass("tile").html(label++);

    // NOTE: Leave rowspan set to 1 because this demo
    // doesn't calculate different row heights
    var tile = {
        col        : null,
        element    : element,
        height     : 0,
        inBounds   : true,
        index      : null,
        isDragging : false,
        lastIndex  : null,
        newTile    : true,
        positioned : false,
        row        : null,
        rowspan    : 1,
        width      : 0,
        x          : 0,
        y          : 0
    };

    // Add tile properties to our element for quick lookup
    element[0].tile = tile;
    $list.append(element);

    //This makes the new tile draggable
    //When zIndexBoost is set to true, the z-index automatically increase by one when it is pressed.
    // This keeps the stacking order correct (newly placed objects are on top)
    //In the example this is set to false, and then the zindex is increased in the onRelease and onPress functions.
    //I don't know why, but it might be clear later.
    Draggable.create(element, {
        type: "x,y",
        zIndexBoost : true,
        //Functions are called for when the tile is pressed, for when it is released.
        onPress     : onPress,
        onRelease   : onRelease,
    });

    function onRelease() {
        //This TweenMax restores the tile to it's usual size and normal shadow
        TweenMax.to(element, 0.2, {
            autoAlpha : 1,
            boxShadow: shadow1,
            scale     : 1,
        });
    }//end of onRelease Function

    function onPress() {

        //This TweenMax gives the dragTile its shadow and change in size
        //The z-index makes sure that the tile that is pressed is on top of the other tiles
        TweenMax.to(element, 0.2, {
            autoAlpha : 0.75,
            boxShadow : shadow2,
            scale     : 0.95,
        });
    }//end of onPress Function


}//End of function to add a tile

