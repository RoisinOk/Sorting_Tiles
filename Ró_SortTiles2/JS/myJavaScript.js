/**
 * Created by roisinokeeffe on 05/06/2015.
 */
var $list = $("#list1");
var labelCount = 1;

Draggable.create(".tile", {
    type: "x,y",
    zIndexBoost : false
});


function addTile(){

    var element = $("<div></div>").addClass("tile").html("New Tile "+ labelCount++);

    $list.append(element);

    Draggable.create(element, {
        type: "x,y",
        zIndexBoost : false
    });
}