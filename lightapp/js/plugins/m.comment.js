var Mo = Mo || {};
Mo.comment = function(options){
    this.pl_total = -1;
    this.pl_page = 1;
    this.is_load_over = false;
    this.comments = [];
    this.mpage = options.mpage;
    this.aid = options.aid;
    this.pid = options.pid;
    this.pname = options.pname;
    this.channel = options.channel || 1;
    this.firstLoadNum = options.firstLoadNum || 6;//第一页加载6条
    this.loadPerNum = options.loadPerNum || 10;//后续每页加载10条
    this.target = options.target;
    this.container = options.container;
    this.commentPageTmpl = options.commentPageTmpl || '\
        <form class="comment_form" id="j-comment_form" style="display:none">\
            <div class="comment_form_hd" style="position:absolute;">\
                <h1 class="title">写评论</h1>\
                <span class="hashover btn_cancel">取消</span>\
                <span class="btn_submit hashover">发布</span>\
            </div>\
            <div class="comment_star">\
                <span class="star_l" data-star="3"><span class="star_l_3"></span></span>\
                <span class="star_text">一般！</span>\
            </div>\
            <div class="comment_input">\
                <textarea placeholder="写评论..."></textarea>\
            </div>\
        </form>\
    ';

    this.commentListItemTmpl = options.commentListItemTmpl || '\
        <% for( var i = 0, item; item = comments[i], i < comments.length; i++ ){ %>\
            <li class="item">\
                <div class="item_in">\
                    <div class="clearfix">\
                        <img src="<%= item.avatar %>" class="avatar"/>\
                        <span class="fl">\
                            <span class="nick"><%= item.nick %></span>\
                            <% if (item.good == 1){ %><span class="essence"><i></i>精彩评论</span><% } %>\
                            <span class="star"><span class="star_<%= item.star %>"></span></span>\
                        </span>\
                        <% if (item.id > 0){ %><span class="btn_reply fr hashover" data-cid="<%= item.id %>"><i></i></span><% } %>\
                    </div>\
                    <div class="content"><%:= item.content  %></div>\
                    <div class="clearfix"><% if (item.from != "" ){ %><span class="from fl">来自：<%= item.from %></span><% } %><span class="created fr"><%= item.created %></span></div>\
                    <div class="reply_list" data-end="5" <% if (item.reply.length == 0){ %>style="display:none"<% } %>>\
                        <i class="ico_arrow_up"></i>\
                        <ul>\
                            <% for(var k = 0, r_item; r_item = item.reply[k] , k < item.reply.length; k++){ %>\
                                <li class="reply" <% if (k >= 5){ %>style="display:none;"<% } %>>\
                                    <dl class="reply_meta">\
                                        <dt class="reply_nick"><%= r_item.nick %>：</dt>\
                                        <dd class="reply_content"><%:= r_item.content  %></dd>\
                                    </dl>\
                                </li>\
                            <% } %>\
                        </ul>\
                        <% if (item.reply.length > 5){ %>\
                        <div class="load_reply">\
                            <p>点击查看更多回复<p/>\
                            <p><i></i></p>\
                        </div>\
                        <% } %>\
                    </div>\
                </div>\
            </li>\
        <% } %>\
    ';

    this.replyListItemTmpl = options.replyListItemTmpl || '\
        <% for(var i = 0, item; item = reply[i], i < reply.length; i++ ){ %>\
            <li class="reply">\
                <dl class="reply_meta">\
                    <dt class="reply_nick"><%= item.nick %>：</dt>\
                    <dd class="reply_content"><%:= item.content  %></dd>\
                </dl>\
            </li>\
        <% } %>\
    ';

    this.commentBoxTmpl = options.commentBoxTmpl || '\
        <div class="comment m_box">\
            <div class="comment_hd">\
                <h3 class="title">用户评论</h3>\
                <span class="count"><b class="j-comment_count">0</b>条评论</span>\
            </div>\
            <div class="v_comment_form clearfix">\
                <i class="ico_comment"></i>\
                <div class="textarea">我也说两句</div>\
            </div>\
            <div class="comment_main">\
                <ul class="comment_list"></ul>\
                <div class="load_more hashover loading">评论加载中...</div>\
            </div>\
        </div>\
    ';

    this.createTemplate('commentListItemTmpl', this.commentListItemTmpl);
    this.createTemplate('replyListItemTmpl', this.replyListItemTmpl);
    $(this.target).html(this.commentBoxTmpl);
    $('body').append(this.commentPageTmpl);
    this.init();
}

Mo.comment.prototype = {

    createTemplate : function  (id, html) {
        if (document.getElementById(id)){
             document.getElementById(id).innerHTML = html;
        } else {
           var script = document.createElement('script');
            script.type = 'text/jquery-tmpl-x';
            script.id = id;
            script.innerHTML = html;
            document.head.appendChild(script);   
        } 
    },

    init : function(){
        var mcomment = this,
            $mpage = $(this.target),
            $container = $(this.container);

        var $comment_loadmore = $mpage.find(".load_more"),
            $v_comment_form = $mpage.find(".v_comment_form");

        $comment_loadmore.unbind("click").bind("click", function(){
            var $this = $(this),
                p = parseInt($this.attr("data-page")) || 1;

            if ($this.hasClass("nodata") || $this.hasClass("loading")){
                return false;
            }

            $this.addClass("loading").html("正在加载更多数据...");
            p++;

            $this.attr("data-page", p);
            mcomment.showComments(p);
            return false;
        });

        var last_scroll_top,
            $reply_comment;

        $v_comment_form.unbind("click").bind("click", function(){
            last_scroll_top = window.scrollY;

            $container.hide();
            $("#j-comment_form").show();
            $comment_star.find("span")[0].className = "star_l_3";
            $comment_star.next(".star_text").html(star_texts[3]);
            $comment_star.attr("data-star", 3);

            $("#j-comment_form .comment_star").show();
            $("#j-comment_form .title").html("写评论");
            $('#j-comment_form textarea').attr({
                "placeholder" : "写评论..."
            }).removeAttr("data-cid").focus();
           
            if(Emt.isIDevice){
                window.scrollTo(0,1);
            } else {
                $container[0].style.minHeight = '0px';

                setTimeout(function() {
                    window.scrollTo(0, 1);
                    setTimeout(function() {
                        window.scrollTo(0, 1);
                    }, 100);
                }, 100);
            }
        });

        $(document).undelegate(".btn_reply","click").delegate(".btn_reply","click",function(){
            last_scroll_top = window.scrollY;
            $reply_comment = $(this).parents(".item");

            $container.hide();
            $("#j-comment_form").show();
            //$("#container").addClass('white_bg');
            $comment_star.find("span")[0].className = "star_l_3";
            $comment_star.next(".star_text").html(star_texts[3]);
            $comment_star.attr("data-star", 3);
            $("#j-comment_form .comment_star").hide();
            $("#j-comment_form .title").html("回复");
            $('#j-comment_form textarea').attr({
                "data-cid" : $(this).attr("data-cid"),
                "placeholder" : "回复评论..."
            }).focus();

            if(Emt.isIDevice){
                window.scrollTo(0,1);
            } else {
                $container[0].style.minHeight = '0px';

                setTimeout(function() {
                    window.scrollTo(0, 1);
                    setTimeout(function() {
                        window.scrollTo(0, 1);
                    }, 100);
                }, 100);
            }
        });

        $(document).undelegate(".load_reply","click").delegate(".load_reply","click",function(){
            var reply_list = $(this).parents(".reply_list");
            var end = parseInt(reply_list.attr("data-end"));
            var next = reply_list.find("li").slice(end, end + 10);

            next.show();
            reply_list.attr("data-end", end + 10);
            var top = next.eq(0).offset().top;
            window.scrollTo(0, top - 50);
            console.log(top);
            if(next.length < 10){
                $(this).hide();
            }
        });

        var $comment_star = $(".comment_star .star_l");

        if(Emt.isIDevice){
            $('#j-comment_form textarea').bind("focus", function(e){
                setTimeout(function(){
                    window.scrollTo(0, 1);
                },100);
                e.preventDefault();
            });
        }

        $('#j-comment_form').unbind("submit").bind("submit", function(){
            var $form = $(this),
                $textarea = $form.find("textarea"),
                cid = $textarea.attr("data-cid"),
                star,
                content = $.trim($textarea.val()),
                url;

            if(cid > 0){
                if(content == ''){
                    alert('亲，回复内容不能为空！');
                    return false;
                }

                var url = 'http://comment.5054399.com/comment_ajax.php?ac=reply&reply=' + content + '&pid=' + mcomment.pid+'&fid=' + mcomment.aid + '&cid=' + cid + '&channel=' + mcomment.channel;
            } else {
                if(content == ''){
                    alert('亲，评论内容不能为空！');
                    return false;
                }

                star = parseInt($comment_star.attr("data-star"));

                var url = 'http://comment.5054399.com/comment_ajax.php?ac=comment&comment=' + content + '&pid=' + mcomment.pid+'&fid=' + mcomment.aid + '&star=' + star + '&channel=' + mcomment.channel;

            }

             mcomment.async(url, function(result){
                if(cid > 0){
                    
                    var reply = {
                        'avatar' : 'http://a.img4399.com/0/small',
                        'content' : content + '<p style="color:#ff6600">您的回复正在审核中，请耐心等待...</p>',
                        'created' : '刚刚',
                        'nick' : '4399网友'
                    };

                    $reply_comment.find(".reply_list ul").prepend( baidu.template( $("#replyListItemTmpl").html() , {reply : [reply]}) );

                    $reply_comment.find(".reply_list").show();
                    

                     setTimeout(function(){
                        window.scrollTo(0,$reply_comment.offset().top - 48);
                    }, 300);
                } else {
                    

                    var comment = {
                        'avatar' : 'http://a.img4399.com/0/small',
                        'content' : content + '<p style="color:#ff6600">您的评论正在审核中，请耐心等待...</p>',
                        'created' : '刚刚',
                        'nick' : '4399网友',
                        'star' : star * 2,
                        'reply' : [],
                        'from' : mcomment.parseDevice(mcomment.channel, result.user_agent)
                    };

                $comment_star.find("span")[0].className = "star_l_3";
                $comment_star.next(".star_text").html(star_texts[3]);
                $comment_star.attr("data-star", 3);

                if ($(".comment_list li").length == 0){
                    $comment_loadmore.removeClass("loading").addClass("nodata").html("恭喜您抢到了沙发~");
                }

                $(".comment_list").prepend(baidu.template( $("#commentListItemTmpl").html() , {comments : [comment]}));
                    

                    setTimeout(function(){
                        window.scrollTo(0,$(".comment").offset().top - 48);
                    }, 300);
                }
                $textarea.val('');

                $("#j-comment_form").hide();
                $container.show();
                if(Emt.isAndroid){
                    $container[0].style.minHeight = v_height + 100 + 'px';
                }

                return false;
            });

            return false;
        });

        var star_texts = ['','糟糕！','较差！','一般！','不错！','力荐！'];

        $comment_star.bind("click", function(e){
            var left = e.offsetX;
            var n = Math.ceil(left / 35);

            n = n || 1;
            console.log(n);
            $comment_star.find("span")[0].className = "star_l_" + n;
            $comment_star.next(".star_text").html(star_texts[n]);
            $comment_star.attr("data-star", n);
        });

        $(".btn_submit").unbind("click").bind("click", function(){
            $('#j-comment_form').trigger("submit");
        });

        $(".btn_cancel").unbind("click").bind("click", function(){
            $("#j-comment_form").hide();
            $container.show();


            if(Emt.isAndroid){
                $container[0].style.minHeight = v_height + 100 + 'px';
            }

            setTimeout(function(){
                window.scrollTo(0,last_scroll_top);
            }, 200);

            return false;
        });

        mcomment.showComments(1);
    },

    parseDevice : function(channel, user_agent){
        if(typeof channel === "undefined"){
            return '';
        }

        var from = '4399.cn';

        if (channel == 2 || channel == 1){
            from = user_agent;
            if(!user_agent){
                from = '4399游戏盒'
            }
        }

        return from;
    },

    parseDate : function(timeu){
        var timestatus = '',
            balance = parseInt(Date.parse(new Date()) / 1000 - timeu),
            date = new Date( timeu * 1000 ),
            today = new Date(),
            time_str = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())  + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
            date_str = (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月' +  (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日';

        if(balance <= 60){
            timestatus = '刚刚';
        }else if( today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate()  == date.getDate()){
            timestatus = time_str;
        }else if( today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() - 1 == date.getDate()){
            timestatus = '昨天 ' + time_str;
        } else if( today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() - 2 == date.getDate()){
            timestatus = '前天 ' + time_str;
        } else if(today.getFullYear() == date.getFullYear()){
            timestatus = date_str;
        } else {
            timestatus = date.getFullYear() + '年' +  date_str;
        }

        return timestatus;
    },

    parseContent : function(comment){
        if(typeof comment !== "string") return "";

        comment = comment.replace(/src=["']?(\/images(\/\w+)?\/\d+\.gif)["']?/gi, function(all, key){
            return 'src=http://comment.5054399.com' + key; 
        });

        return comment.trim();
    },

    parseNick : function(uid, ip, username){
        var nick = username;

        if (uid == 0){
            if(ip == "未知"){
                nick = "4399网友";
            } else {
                nick = '4399' + ip + "网友";
            }
        }

        return nick;
    },

    checkNoComments : function(code, page){
        var $comment_loadmore = $(".comment .load_more");

        if (code == 0){
            $comment_loadmore.removeClass("loading").addClass("nodata").html("暂无更多评论");

            if(this.comments.length == 0) {
                $comment_loadmore.html("快来抢沙发~");
                return;
            }

            if (page == 1){
                $comment_loadmore.addClass("nodata_visible");
            }
        } else {
            $comment_loadmore.removeClass("loading").html('点击查看更多评论');
        }
    },

    checkCache : function(end_i, callback){
        var _this = this;

        //缓存数据不够
        if (_this.comments.length <= end_i && !_this.is_load_over){
            _this.getComments(function(code){
                if (_this.comments.length == _this.pl_total && _this.pl_total >= 0){
                    _this.is_load_over = true;//评论已经全部加载完
                    typeof callback === "function" && callback.call(_this);
                    return;
                }

                if (code == 0){
                    _this.is_load_over = true;//评论已经全部加载完
                    typeof callback === "function" && callback.call(_this);
                } else {
                    _this.checkCache(end_i, callback);
                }
            });
        } else {//缓存数据充足
            typeof callback === "function" && callback.call(_this);
        }
    },

    getComments : function(callback){
        var mcomment = this,
            F_ID = mcomment.aid,
            F_DIR = F_ID % 10000;

        var script = document.createElement("script");

        script.onload = function(e){
            mcomment.loadCommentSuccess(callback);
            document.body.removeChild(script);
        }

        script.onerror = function(e){
            mcomment.loadCommentError();
            document.body.removeChild(script);
        }

        script.src = 'http://comment.5054399.com/' + mcomment.pname + '/' + F_DIR + '/' + F_ID+'_' + mcomment.pl_page + '_js.html';
        document.body.appendChild(script);
    },

    loadCommentSuccess : function(callback){
        var  mcomment = this;

        console.log(mcomment);
        try{
            content = content || [];
        } catch(e){
            mcomment.loadCommentError();
            return;
        }

        var comments = [];

            for (var i = 0; i < content.length; i++) {

                content[i]['comment'] = content[i]['comment'].replace(/src=["']?(\/images(\/\w+)?\/\d+\.gif)["']?/gi, function(all, key){
                    return 'src=http://comment.5054399.com' + key;
                });

            var comment = {
                'avatar' : 'http://a.img4399.com/' + content[i]["uid"] + '/small',
                'content' : mcomment.parseContent(content[i]['comment']),
                'id' : content[i]['id'],
                'star' : content[i].star * 2,
                'nick' : mcomment.parseNick(content[i]["uid"], content[i]["ip"], content[i]["username"]),
                'created' : mcomment.parseDate(content[i]['timeu']),
                'reply' : [],
                'good' : content[i]['good'],
                'from' : mcomment.parseDevice(content[i]['channel'], content[i]['user_agent'])
            };

            if(content[i].reply){
                //格式化回复
                for( var k = 0; k < content[i].reply.length; k++){
                    var reply = {
                        'avatar' : 'http://a.img4399.com/' + content[i]['reply'][k]["uid"] + '/small',
                        'content' : mcomment.parseContent( content[i]['reply'][k]['reply'] ),
                        'nick' : mcomment.parseNick( content[i]['reply'][k]["uid"], content[i]['reply'][k]["ip"], content[i]['reply'][k]["username"] ),
                        'created' : mcomment.parseDate( content[i]['reply'][k]['timeu'] )
                    };

                        comment['reply'][k] = reply;
                    }
                }
                comments.push(comment);
            }

            Array.prototype.push.apply(mcomment.comments, comments);

            //第一次加载时
            if(mcomment.pl_page == 1){
                mcomment.pl_total = num;
                $(".j-comment_count").html(num);
            }

            mcomment.pl_page++;

            var code = 1;
            if (content.length < 20){
                code = 0;
            }

        typeof callback === "function" && callback.call(mcomment, code);
        console.log(content);
    },

    loadCommentError : function(){
        var mcomment = this,
            load_more_comment = $(".comment .load_more");

        if(mcomment.pl_total > 0){
            $(".comment .load_more").removeClass("loading").addClass("nodata").html("暂无更多评论");
        } else {
            $(".comment .load_more").html("快来抢沙发~");
        }
    },

    showComments : function(page, callback){
        var _this = this,
            start_i,
            end_i;

        if (page == 1){
            start_i = 0;
            end_i = _this.firstLoadNum;
        } else {
            start_i = (page - 2) * _this.loadPerNum + _this.firstLoadNum;
            end_i = (page - 1) * _this.loadPerNum + _this.firstLoadNum;
        }

        _this.checkCache(end_i, function(){
            //最后一页

            var code = 1;
            if (_this.comments.length <= end_i){
                code = 0;
            }

            var comments = Array.prototype.slice.call(_this.comments, start_i, end_i);
            $(".comment_list").append( baidu.template( $("#commentListItemTmpl").html() , {comments : comments}));
            _this.checkNoComments(code, page);
        });
    },

    async : function(url, success, failure){
        var script = document.createElement("script"),
            calbackname = 'JSONP' + (new Date() - 0);

        success = typeof success === 'function' ? success : function(){};   
        failure = typeof failure === 'function' ? failure : function(){};

        window[calbackname] = success;

        script.onload = function(e){
            document.body.removeChild(script);
            delete window[calbackname];  
        }

        script.onerror = function(e){
            failure();
            document.body.removeChild(script);
            delete window[calbackname]; 
        }

        if(url.indexOf("?") >= 0){
            url += '&callback=' + calbackname;
        } else {
           url += '?callback=' + calbackname; 
        }

        script.src = url;

        document.body.appendChild(script);
    }
}