var url = 'https://codeforces.com/api/user.info?handles=';
var card = '<td class="*"><img src="*" class="user-img"></td><td class="*"><a href="*" class="rated-user *">*</a><p class="user-rating">Рейтиг: <span class="user-rating-val *">*</span></p></td>'

var users = []

var table = $(".datatable table tbody")[0];
var users_html = $(table);


function parseUsers(xhr) {
    console.log(xhr.status);
    users = xhr.result;
    ind = 0;
    users.forEach(function(user) {
        if (ind % 2) user_card = card.replace('*', "");
        else user_card = card.replace('*', "dark");

        user_card = user_card.replace('*', user.avatar);
        if (ind % 2) user_card = user_card.replace('*', "");
        else user_card = user_card.replace('*', "dark");

        user_card = user_card.replace('*', "https://codeforces.com/profile/" + user.handle);
        rating = user.rating;
        rank = "newbie";
        if (!rating) {
            rank = "headquarters";
            rating = "Штаб";
        } else if (rating >= 3000) {
            rank = "legendaryGrandmaster";
        } else if (rating >= 2600) {
            rank = "internationalGrandmaster";
        } else if (rating >= 2400) {
            rank = "grandmaster";
        } else if (rating >= 2100) {
            rank = "master";
        } else if (rating >= 1900) {
            rank = "candidateMaster";
        } else if (rating >= 1600) {
            rank = "expert";
        } else if (rating >= 1400) {
            rank = "specialist";
        } else if (rating >= 1200) {
            rank = "pupil";
        } else {
            rank = "newbie";
        }

        user_card = user_card.replace('*', rank).replace('*', user.handle).replace('*', rank).replace('*', rating);
        $($(users_html.find("tr")[ind]).find("td")[0]).remove();
        $($(users_html.find("tr")[ind]).find("td")[0]).remove();
        $(users_html.find("tr")[ind]).prepend(user_card);
        ind += 1;
    });
}

$(document).ready(function() {
    $(".datatable table tr").each(function(index) {
        if (index) {
            user = $(this, "a").find(".rated-user");
            if (user.length) {
                users.push(user[0].text);
            }
        }
    });

    users_string = "";
    for (i = 0; i < users.length; ++i)
        users_string += users[i] + ";";

    $.ajax({
        url: url + users_string,
        type: 'POST',
        dataType: 'json',
        success: function(xhr) { parseUsers(xhr); },
        error: function(xhr) {
            alert('error');
            console.log(xhr.status);
        },
    });
});