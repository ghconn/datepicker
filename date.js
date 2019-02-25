var weekday;
(function (weekday) {
    weekday[weekday["Sun"] = 0] = "Sun";
    weekday[weekday["Mon"] = 1] = "Mon";
    weekday[weekday["Tue"] = 2] = "Tue";
    weekday[weekday["Wed"] = 3] = "Wed";
    weekday[weekday["Thu"] = 4] = "Thu";
    weekday[weekday["Fri"] = 5] = "Fri";
    weekday[weekday["Sat"] = 6] = "Sat";
})(weekday || (weekday = {}));
var datepickerInitor = /** @class */ (function () {
    function datepickerInitor(selector) {
        this.hosts = document.querySelectorAll("[data-type=" + selector + "]");
        this.hosts.forEach(function (host) { return new datepicker(host); });
    }
    return datepickerInitor;
}());
var datepicker = /** @class */ (function () {
    function datepicker(host) {
        this.host = host;
        this.init();
        this.bind();
    }
    Object.defineProperty(datepicker.prototype, "year", {
        get: function () {
            return this.year;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(datepicker.prototype, "month", {
        get: function () {
            return this._month;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(datepicker.prototype, "day", {
        get: function () {
            return this._day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(datepicker.prototype, "weekday", {
        get: function () {
            return this._weekday;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(datepicker.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    datepicker.prototype.init = function () {
        this._value = this.host.value;
        var reg = new RegExp(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (reg.test(this._value)) {
            this._year = parseInt(RegExp.$1);
            this._month = parseInt(RegExp.$2);
            this._day = parseInt(RegExp.$3);
            this._weekday = new Date(this._year, this._month, this._day).getDay();
        }
        else {
            var now = new Date();
            this._year = now.getFullYear();
            this._month = now.getMonth() + 1; //getMonth()取值为0-11表示1-12月
            this._day = now.getDate();
            this._weekday = now.getDay();
        }
        this.render();
    };
    datepicker.prototype.render = function () {
        var $wraper = document.createElement("div");
        $wraper.className = "ui-datepicker-wrap";
        /*head----------------------------------------------*/
        var pickerhead = document.createElement("div");
        pickerhead.className = "ui-datepicker-head";
        var $btnPrev = document.createElement("a");
        $btnPrev.className = "ui-datepicker-btn ui-datepicker-prev-btn";
        $btnPrev.setAttribute("href", "#");
        $btnPrev.text = "<";
        var $btnNext = document.createElement("a");
        $btnNext.className = "ui-datepicker-btn ui-datepicker-next-btn";
        $btnNext.setAttribute("href", "#");
        $btnNext.text = ">";
        var $span = document.createElement("span");
        $span.className = "datepicker-curr-month";
        $span.innerText = this._year + "-" + this._month;
        pickerhead.appendChild($btnPrev);
        pickerhead.appendChild($btnNext);
        pickerhead.appendChild($span);
        /*body----------------------------------------------*/
        var pickerbody = document.createElement("div");
        pickerbody.className = "ui-datepicker-body";
        var datepanel = document.createElement("table");
        datepanel.className = "date-checked";
        var datethead = "<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>";
        this.tbody = document.createElement("tbody");
        //this.rendertbody(this._year, this._month);
        datepanel.innerHTML = datethead;
        datepanel.appendChild(this.tbody);
        var monthpanel = document.createElement("table");
        monthpanel.className = "ui-monthpicker";
        var mhtml = "<thead></thead>";
        mhtml += "<tbody>";
        mhtml += "   <tr><td>1月</td><td>2月</td><td>3月</td></tr>";
        mhtml += "   <tr><td>4月</td><td>5月</td><td>6月</td></tr>";
        mhtml += "   <tr><td>7月</td><td>8月</td><td>9月</td></tr>";
        mhtml += "   <tr><td>10月</td><td>11月</td><td>12月</td></tr>";
        mhtml += "</tbody>";
        monthpanel.innerHTML = mhtml;
        pickerbody.append(datepanel);
        pickerbody.append(monthpanel);
        /*--------------------------------------------------*/
        $wraper.appendChild(pickerhead);
        $wraper.appendChild(pickerbody);
        this.host.parentNode.appendChild($wraper);
        this.btnPrev = $btnPrev;
        this.btnNext = $btnNext;
        this.spanYearMonth = $span;
        this.datepanel = datepanel;
        this.monthpanel = monthpanel;
        this.wraper = $wraper;
        this.wraper.style.left = this.host.offsetLeft + 'px';
        this.wraper.style.top = (this.host.offsetTop + this.host.offsetHeight + 2) + 'px';
    };
    datepicker.prototype.rendertbody = function (year, month) {
        var tbodyhtml = "";
        var lastDateOfLastMonth = new Date(year, month - 1, 0).getDate(); //上月最后一天是几号
        var lastDate = new Date(year, month, 0).getDate(); //当月最后一天是几号
        var weekday = new Date(year, month - 1, 1).getDay(); //当月第一天是星期几
        for (var i = 0; i < 42; i++) { //i=(weekday-1)+hao
            if (i % 7 == 0)
                tbodyhtml += "<tr>";
            if (i < weekday) {
                tbodyhtml += "<td class='prev-month'>" + (lastDateOfLastMonth - weekday + i + 1) + "</td>";
            }
            else if (i > weekday + lastDate - 1) {
                tbodyhtml += "<td class='next-month'>" + (i - weekday - lastDate + 1) + "</td>";
            }
            else {
                var day = i - weekday + 1;
                if (this._year == year && this._month == month && day == this._day)
                    tbodyhtml += "<td class='day-checked'>" + day + "</td>";
                else
                    tbodyhtml += "<td>" + day + "</td>";
            }
            if (i % 7 == 6)
                tbodyhtml += "</tr>";
        }
        this.tbody.innerHTML = tbodyhtml;
    };
    datepicker.prototype.renderPrevtbody = function () {
        var $span = this.spanYearMonth;
        var spanvalue = $span.innerText.split("-");
        var spanYear = parseInt(spanvalue[0]);
        var spanMonth = parseInt(spanvalue[1]);
        if (spanMonth === 1) {
            this.rendertbody(spanYear - 1, 12);
            $span.innerText = (spanYear - 1) + '-' + 12;
        }
        else {
            this.rendertbody(spanYear, spanMonth - 1);
            $span.innerText = spanYear + '-' + (spanMonth - 1);
        }
    };
    datepicker.prototype.renderNexttbody = function () {
        var $span = this.spanYearMonth;
        var spanvalue = $span.innerText.split("-");
        var spanYear = parseInt(spanvalue[0]);
        var spanMonth = parseInt(spanvalue[1]);
        if (spanMonth === 12) {
            this.rendertbody(spanYear + 1, 1);
            $span.innerText = (spanYear + 1) + '-' + 1;
        }
        else {
            this.rendertbody(spanYear, spanMonth + 1);
            $span.innerText = spanYear + '-' + (spanMonth + 1);
        }
    };
    datepicker.prototype.bind = function () {
        var _this = this;
        this.wraper.addEventListener("click", function (ev) {
            var $target = ev.target;
            var tagname = $target.tagName.toLowerCase();
            if (tagname === "a" && _this.datepanelisvisible()) {
                $target.classList.contains("ui-datepicker-prev-btn") && _this.renderPrevtbody();
                $target.classList.contains("ui-datepicker-next-btn") && _this.renderNexttbody();
            }
            if (tagname === "a" && !_this.datepanelisvisible()) {
                if ($target.classList.contains("ui-datepicker-prev-btn"))
                    _this.spanYearMonth.innerText = (parseInt(_this.spanYearMonth.innerText.split('-')[0]) - 1).toString();
                if ($target.classList.contains("ui-datepicker-next-btn"))
                    _this.spanYearMonth.innerText = (parseInt(_this.spanYearMonth.innerText.split('-')[0]) + 1).toString();
            }
            if (tagname === "span") {
                _this.toggleMonthOrDate();
            }
            if (tagname === "td") {
                _this.pickdate($target);
            }
        }, false);
        this.host.addEventListener("click", function (ev) {
            _this.toggle();
        }, false);
    };
    datepicker.prototype.toggleMonthOrDate = function (month) {
        this.datepanelisvisible() ? (this.datepanel.style.display = 'none',
            this.monthpanel.style.display = 'block',
            this.spanYearMonth.setAttribute('currmonth', this.spanYearMonth.innerText.split('-')[1]),
            this.spanYearMonth.innerText = this.spanYearMonth.innerText.split('-')[0]) : (this.datepanel.style.display = '',
            this.monthpanel.style.display = 'none',
            this.spanYearMonth.innerText = this.spanYearMonth.innerText + '-' + (month ? month : this.spanYearMonth.getAttribute('currmonth')));
    };
    datepicker.prototype.datepanelisvisible = function () {
        return this.datepanel.style.display !== "none";
    };
    datepicker.prototype.pickdate = function (td) {
        if (this.datepanelisvisible()) {
            var $span = this.spanYearMonth;
            var spanvalue = $span.innerText.split("-");
            var spanYear = parseInt(spanvalue[0]);
            var spanMonth = parseInt(spanvalue[1]);
            var classlist = td.classList;
            this._year = spanYear;
            this._month = spanMonth;
            if (classlist.contains("prev-month") && spanMonth === 1) {
                this._year = spanYear - 1;
                this._month = 12;
            }
            else if (classlist.contains("prev-month")) {
                this._month = spanMonth - 1;
            }
            else if (classlist.contains("next-month") && spanMonth === 12) {
                this._year = spanYear + 1;
                this._month = 1;
            }
            else if (classlist.contains("next-month")) {
                this._month = spanMonth + 1;
            }
            this._day = parseInt(td.innerText);
            this._weekday = new Date(this._year, this._month, this._day).getDay();
            this._value = this._year + '-' + this._month + '-' + this._day;
            this.host.value = this._value;
            this.hide();
        }
        else {
            this.toggleMonthOrDate(td.innerText.replace('月', ''));
            this.rendertbody(parseInt(this.spanYearMonth.innerText.split('-')[0]), parseInt(this.spanYearMonth.innerText.split('-')[1]));
        }
    };
    datepicker.prototype.show = function () {
        this.wraper.style.display = 'block';
        this.spanYearMonth.innerText = this._year + "-" + this._month;
        this.rendertbody(this._year, this._month);
    };
    datepicker.prototype.hide = function () {
        this.wraper.style.display = 'none';
    };
    datepicker.prototype.toggle = function () {
        this.wraper.style.display === 'block' ? this.hide() : this.show();
    };
    return datepicker;
}());
new datepickerInitor("datepicker");
