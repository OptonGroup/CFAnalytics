$(document).ready(function() {
    var groupContestsSidebarFrame = $(".GroupContestsSidebarFrame")

    var icon = groupContestsSidebarFrame.find(".sidebar-caption-icon")
    icon.removeClass('la-angle-down').addClass('la-angle-right');

    var constestList = groupContestsSidebarFrame.find("ul")
    console.log(constestList.css("display", "none"));
});