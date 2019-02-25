enum weekday{Sun=0,Mon=1,Tue=2,Wed=3,Thu=4,Fri=5,Sat=6}
class datepickerInitor{
   hosts: NodeListOf<HTMLInputElement>

   constructor(selector: string){
      this.hosts = document.querySelectorAll(`[data-type=${selector}]`)
      this.hosts.forEach((host) => new datepicker(host))
   }
}
class datepicker{
   private _year: number//年
   private _month: number//月
   private _day: number//日
   private _weekday: weekday//星期几
   private host: HTMLInputElement
   private wraper: HTMLDivElement
   private tbody: HTMLElement
   private btnPrev: HTMLAnchorElement
   private btnNext: HTMLAnchorElement
   private spanYearMonth: HTMLSpanElement
   private datepanel: HTMLTableElement
   private monthpanel: HTMLTableElement
   private _value: string

   get year() : number{
      return this.year
   }

   get month() : number{
      return this._month
   }

   get day() : number{
      return this._day
   }

   get weekday() : number{
      return this._weekday
   }

   get value() : string{
      return this._value
   }

   constructor(host: HTMLInputElement){
      this.host = host
      this.init()
      this.bind()
   }

   private init(){
      this._value = this.host.value
      var reg = new RegExp(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
      if(reg.test(this._value)){
         this._year = parseInt(RegExp.$1)
         this._month = parseInt(RegExp.$2)
         this._day = parseInt(RegExp.$3)
         this._weekday = new Date(this._year, this._month, this._day).getDay()
      }
      else{
         var now = new Date()
         this._year = now.getFullYear()
         this._month = now.getMonth() + 1//getMonth()取值为0-11表示1-12月
         this._day = now.getDate()
         this._weekday = now.getDay()
      }

      this.render()
   }
   private render(){
      var $wraper = document.createElement("div")
      $wraper.className = "ui-datepicker-wrap"

      /*head----------------------------------------------*/
      var pickerhead = document.createElement("div")
      pickerhead.className = "ui-datepicker-head"

      var $btnPrev = document.createElement("a")
      $btnPrev.className = "ui-datepicker-btn ui-datepicker-prev-btn"
      $btnPrev.setAttribute("href", "#")
      $btnPrev.text = "<"

      var $btnNext = document.createElement("a")
      $btnNext.className = "ui-datepicker-btn ui-datepicker-next-btn"
      $btnNext.setAttribute("href", "#")
      $btnNext.text = ">"

      var $span = document.createElement("span")
      $span.className = "datepicker-curr-month"
      $span.innerText = this._year + "-" + this._month

      pickerhead.appendChild($btnPrev)
      pickerhead.appendChild($btnNext)
      pickerhead.appendChild($span)

      /*body----------------------------------------------*/
      var pickerbody = document.createElement("div")
      pickerbody.className = "ui-datepicker-body"
      var datepanel = document.createElement("table")
      datepanel.className = "date-checked"
      var datethead = "<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>"
      this.tbody = document.createElement("tbody")
      //this.rendertbody(this._year, this._month)

      datepanel.innerHTML = datethead
      datepanel.appendChild(this.tbody)
      
      var monthpanel = document.createElement("table")
      monthpanel.className = "ui-monthpicker"
      var mhtml = "<thead></thead>"
      mhtml +=    "<tbody>"
      mhtml +=    "   <tr><td>1月</td><td>2月</td><td>3月</td></tr>"
      mhtml +=    "   <tr><td>4月</td><td>5月</td><td>6月</td></tr>"
      mhtml +=    "   <tr><td>7月</td><td>8月</td><td>9月</td></tr>"
      mhtml +=    "   <tr><td>10月</td><td>11月</td><td>12月</td></tr>"
      mhtml +=    "</tbody>"
      monthpanel.innerHTML = mhtml

      pickerbody.append(datepanel)
      pickerbody.append(monthpanel)

      /*--------------------------------------------------*/
      $wraper.appendChild(pickerhead)
      $wraper.appendChild(pickerbody)
      this.host.parentNode.appendChild($wraper)


      this.btnPrev = $btnPrev
      this.btnNext = $btnNext
      this.spanYearMonth = $span
      this.datepanel = datepanel
      this.monthpanel = monthpanel
      this.wraper = $wraper

      this.wraper.style.left = this.host.offsetLeft + 'px'
      this.wraper.style.top = (this.host.offsetTop + this.host.offsetHeight + 2) + 'px'
   }
   private rendertbody(year: number, month: number){
      var tbodyhtml = ""
      var lastDateOfLastMonth = new Date(year, month - 1, 0).getDate()//上月最后一天是几号
      var lastDate = new Date(year, month, 0).getDate()//当月最后一天是几号
      var weekday = new Date(year, month - 1, 1).getDay()//当月第一天是星期几

      for(var i = 0; i < 42; i++){//i=(weekday-1)+hao
         if(i % 7 == 0)
            tbodyhtml += "<tr>"

         if(i < weekday){
            tbodyhtml += `<td class='prev-month'>${lastDateOfLastMonth - weekday + i + 1}</td>`
         }
         else if(i > weekday + lastDate - 1){
            tbodyhtml += `<td class='next-month'>${i - weekday - lastDate + 1}</td>`
         }
         else{
            var day = i - weekday + 1
            if(this._year == year && this._month == month && day == this._day)
               tbodyhtml += `<td class='day-checked'>${day}</td>`
            else
               tbodyhtml += `<td>${day}</td>`
         }

         if(i % 7 == 6)
            tbodyhtml += "</tr>"
      }
      this.tbody.innerHTML = tbodyhtml
   }

   private renderPrevtbody(){
      var $span = this.spanYearMonth
      var spanvalue = $span.innerText.split("-")
      var spanYear = parseInt(spanvalue[0])
      var spanMonth = parseInt(spanvalue[1])

      if(spanMonth === 1){
         this.rendertbody(spanYear - 1, 12)
         $span.innerText = (spanYear - 1) + '-' + 12
      }
      else{
         this.rendertbody(spanYear, spanMonth - 1)
         $span.innerText = spanYear + '-' + (spanMonth - 1)
      }      
   }

   private renderNexttbody(){
      var $span = this.spanYearMonth
      var spanvalue = $span.innerText.split("-")
      var spanYear = parseInt(spanvalue[0])
      var spanMonth = parseInt(spanvalue[1])

      if(spanMonth === 12){
         this.rendertbody(spanYear + 1, 1)
         $span.innerText = (spanYear + 1) + '-' + 1
      }
      else{
         this.rendertbody(spanYear, spanMonth + 1)
         $span.innerText = spanYear + '-' + (spanMonth + 1)
      }
   }

   private bind(){
      this.wraper.addEventListener("click", (ev) => {
         var $target = ev.target as HTMLElement;
         var tagname = $target.tagName.toLowerCase()

         if(tagname === "a" && this.datepanelisvisible()){
            $target.classList.contains("ui-datepicker-prev-btn") && this.renderPrevtbody()
            $target.classList.contains("ui-datepicker-next-btn") && this.renderNexttbody()
         }

         if(tagname === "a" && !this.datepanelisvisible()){
            if($target.classList.contains("ui-datepicker-prev-btn"))
               this.spanYearMonth.innerText = (parseInt(this.spanYearMonth.innerText.split('-')[0]) - 1).toString()
            if($target.classList.contains("ui-datepicker-next-btn"))
               this.spanYearMonth.innerText = (parseInt(this.spanYearMonth.innerText.split('-')[0]) + 1).toString()
         }

         if(tagname === "span"){
            this.toggleMonthOrDate()
         }

         if(tagname === "td"){
            this.pickdate($target)
         }
      }, false)

      this.host.addEventListener("click", (ev) => {
         this.toggle()
      }, false)
   }

   toggleMonthOrDate(month?: string|number){
      this.datepanelisvisible() ? (
         this.datepanel.style.display = 'none', 
         this.monthpanel.style.display = 'block',
         this.spanYearMonth.setAttribute('currmonth', this.spanYearMonth.innerText.split('-')[1]),
         this.spanYearMonth.innerText = this.spanYearMonth.innerText.split('-')[0]) : (
         this.datepanel.style.display = '', 
         this.monthpanel.style.display = 'none',
         this.spanYearMonth.innerText = this.spanYearMonth.innerText + '-' + (month ? month : this.spanYearMonth.getAttribute('currmonth')))      
   }

   datepanelisvisible() : boolean{
      return this.datepanel.style.display !== "none"
   }

   pickdate(td: HTMLElement){
      if(this.datepanelisvisible()){
         var $span = this.spanYearMonth
         var spanvalue = $span.innerText.split("-")
         var spanYear = parseInt(spanvalue[0])
         var spanMonth = parseInt(spanvalue[1])

         var classlist = td.classList
         this._year = spanYear
         this._month = spanMonth
         if(classlist.contains("prev-month") && spanMonth === 1){
            this._year = spanYear - 1
            this._month = 12
         }
         else if(classlist.contains("prev-month")){
            this._month = spanMonth - 1
         }
         else if(classlist.contains("next-month") && spanMonth === 12){
            this._year = spanYear + 1
            this._month = 1
         }
         else if(classlist.contains("next-month")){
            this._month = spanMonth + 1
         }
         this._day = parseInt(td.innerText)
         this._weekday = new Date(this._year, this._month, this._day).getDay()
         this._value = this._year + '-' + this._month + '-' + this._day

         this.host.value = this._value
         this.hide()
      }
      else{
         this.toggleMonthOrDate(td.innerText.replace('月', ''))
         this.rendertbody(parseInt(this.spanYearMonth.innerText.split('-')[0]), parseInt(this.spanYearMonth.innerText.split('-')[1]))
      }
   }

   show(){      
      this.wraper.style.display = 'block'
      this.spanYearMonth.innerText = this._year + "-" + this._month
      this.rendertbody(this._year, this._month)
   }

   hide(){
      this.wraper.style.display = 'none'
   }

   toggle(){
      this.wraper.style.display === 'block' ? this.hide() : this.show()
   }
}
new datepickerInitor("datepicker")
