/**
 * Created by roisinokeeffe on 05/06/2015.
 */

//this selects the list div which contains the tiles
var $list = $("#list1");
//var $container =$("#container")
var $list2 = $("#list2");
var $list3 = $("#list3");


//The shadows refer to the values of the box shadow on the tiles
//shadow1 is the normal shadow
//shadow2 is the bigger shadow for when they are being moved
var shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
var shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";
//The Label is the number of the tile as it is created. It increased with each tile.
var label = 1;
var sortableLabel = 1;
//The z-index property specifies the stack order of an element. Bigger numbers are closer.
var zIndex = 1000;



var tiles  = $list[0].getElementsByClassName("tile");//the list of tiles

//createSortable("#list3");


//=====================================================================================
    //CREATE A TILE
//=====================================================================================

//The addTile function appends another tile to the list div.
function addTile(){
    //This declares a new div element with a class of tile, and gives it a HTML label of a number.
    //Then the new element is appended to the list div.
    var element = $("<li></li>").addClass("tile").html(label++);


    //This makes the new tile draggable
    //When zIndexBoost is set to true, the z-index automatically increase by one when it is pressed.
    // This keeps the stacking order correct (newly placed objects are on top)
    //In the example this is set to false, and then the zindex is increased in the onRelease and onPress functions.
    //I don't know why, but it might be clear later.
    Draggable.create(element, {
        //Functions are called for when the tile is pressed, for when it is released
        onPress     : onPress,
        onRelease   : onRelease,
        zIndexBoost : false
    });//end of create draggable

    // NOTE: Leave rowspan set to 1 because this demo doesn't calculate different row heights
    var tile = {
        col        : null,
        colspan     : 1,
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


    function onPress() {

        lastX = this.x;
        tile.isDragging = true;
        tile.lastIndex  = tile.index;
        //This TweenMax gives the dragTile its shadow and change in size
        //The z-index makes sure that the tile that is pressed is on top of the other tiles
        TweenMax.to(element, 0.2, {
            autoAlpha : 0.75,
            boxShadow : shadow2,
            scale     : 0.95,
            zIndex    : "+=1000"
        });
    }//end of onPress Function


    function onRelease() {
        //This TweenMax restores the tile to it's usual size and normal shadow
        TweenMax.to(element, 0.2, {
            autoAlpha : 1,
            boxShadow : shadow1,
            scale     : 1,
            zIndex    : ++zIndex
        });

    }//end of onRelease Function

}//End of function to add a tile

//=====================================================================================
//CREATE A SORTABLE (http://codepen.io/jamiejefferson/pen/iFDow/?editors=101)
//=====================================================================================

function createSortable(selector) {
    var sortable = document.querySelector(selector);
    Draggable.create(sortable.children, {
        type: "y",
        bounds: sortable,
        edgeResistance: 1,
        onPress: sortablePress,
        onDragStart: sortableDragStart,
        onDrag: sortableDrag,
        liveSnap: sortableSnap,
        onDragEnd: sortableDragEnd
    });
}

function sortablePress() {
    var t = this.target,
        i = 0,
        child = t;
    while(child = child.previousSibling)
        if (child.nodeType === 1) i++;
    t.currentIndex = i;
    t.currentHeight = t.offsetHeight;
    t.kids = [].slice.call(t.parentNode.children); // convert to array
}

function sortableDragStart() {
    TweenMax.set(this.target, { color: "#88CE02" });
}

function sortableDrag() {
    var t = this.target,
        elements = t.kids.slice(), // clone
        indexChange = Math.round(this.y / t.currentHeight),
        bound1 = t.currentIndex,
        bound2 = bound1 + indexChange;
    if (bound1 < bound2) { // moved down
        TweenMax.to(elements.splice(bound1+1, bound2-bound1), 0.15, { yPercent: -100 });
        TweenMax.to(elements, 0.15, { yPercent: 0 });
    } else if (bound1 === bound2) {
        elements.splice(bound1, 1);
        TweenMax.to(elements, 0.15, { yPercent: 0 });
    } else { // moved up
        TweenMax.to(elements.splice(bound2, bound1-bound2), 0.15, { yPercent: 100 });
        TweenMax.to(elements, 0.15, { yPercent: 0 });
    }
}

function sortableSnap(y) {
    var h = this.target.currentHeight;
    return Math.round(y / h) * h;
}

function sortableDragEnd() {
    var t = this.target,
        max = t.kids.length - 1,
        newIndex = Math.round(this.y / t.currentHeight);
    newIndex += (newIndex < 0 ? -1 : 0) + t.currentIndex;
    if (newIndex === max) {
        t.parentNode.appendChild(t);
    } else {
        t.parentNode.insertBefore(t, t.kids[newIndex+1]);
    }
    TweenMax.set(t.kids, { yPercent: 0, overwrite: "all" });
    TweenMax.set(t, { y: 0, color: "" });
}

//=====================================================================================
//ADD A SORTABLE TILE (CALLED BY ADD A SORTABLE TILE BUTTON)
//=====================================================================================

function addSortable() {
    //alert("pressed");

    //This declares a new div element with a class of tile, and gives it a HTML label of a number.
    //Then the new element is appended to the list div.
    var sortableElement = $("<li></li>").addClass("sortableTile").html(sortableLabel++);
    $list2.append(sortableElement);

    Draggable.create(sortableElement, {
        type            : "y",
        bounds          : $list2,
        edgeResistance  : 1,
        onPress         : onSortablePress,
        onDragStart     : onSortableDragStart,
        onDrag          : sortableDrag,
        liveSnap        : sortableSnap,
        onDragEnd       : sortableDragEnd,
    });

    function onSortablePress() {
        var t = this.target,
            i = 0,
            child = t;
        while(child = child.previousSibling)
            if (child.nodeType === 1) i++;
        t.currentIndex = i;
        //The offsetHeight property returns viewable height of an element,
        // including padding, border and scrollbar, but not the margin.
        t.currentHeight = t.offsetHeight;
        t.kids = [].slice.call(t.parentNode.children); // convert to array
    }//end of onSortablePress Function

    function onSortableDragStart(){
        //This TweenMax gives the dragTile its shadow and change in size
        //The z-index makes sure that the tile that is pressed is on top of the other tiles
        TweenMax.to(sortableElement, 0.2, {
            autoAlpha : 0.75,
            boxShadow : shadow2,
            scale     : 0.95,
            zIndex    : "+=1000"
        });
    }// end of function sortableDragStart

    function sortableDragEnd() {
        var t = this.target,
            max = t.kids.length - 1,
            newIndex = Math.round(this.y / t.currentHeight);
        newIndex += (newIndex < 0 ? -1 : 0) + t.currentIndex;
        if (newIndex === max) {
            t.parentNode.appendChild(t);
        } else {
            t.parentNode.insertBefore(t, t.kids[newIndex+1]);
        }//end of if/else
        TweenMax.to(sortableElement, 0.2, {
            autoAlpha : 1,
            boxShadow : shadow1,
            scale     : 1,
            zIndex    : ++zIndex
        });
    }

    function sortableDrag() {
        var t = this.target,
            elements = t.kids.slice(), // clone
            indexChange = Math.round(this.y / t.currentHeight),
            bound1 = t.currentIndex,
            bound2 = bound1 + indexChange;
        if (bound1 < bound2) { // moved down
            TweenMax.to(elements.splice(bound1+1, bound2-bound1), 0.15, { yPercent: -100 });
            TweenMax.to(elements, 0.15, { yPercent: 0 });
        } else if (bound1 === bound2) {
            elements.splice(bound1, 1);
            TweenMax.to(elements, 0.15, { yPercent: 0 });
        } else { // moved up
            TweenMax.to(elements.splice(bound2, bound1-bound2), 0.15, { yPercent: 100 });
            TweenMax.to(elements, 0.15, { yPercent: 0 });
        }
    }//end sortableDrag function

    function sortableSnap(y) {
        var h = this.target.currentHeight;
        return Math.round(y / h) * h;
    }//end sortableSnap function

}//end of add sortable function