/**
 * jQuery Turing Machine plugin
 * (C)2012 - Samuele ~redShadow~ Santi <redshadow@hackzine.org>
 * Under GPL v2 or later
 */
(function($){

    var mod=function(v,m){ return ((v%m)+m)%m; };
    var toAscii = function(i) {
        if (i>=32 && i<=126) {
            return String.fromCharCode(i);
        }
        else {
            return '<i style="color:#888;">?</i>';
        }
    };
    var zeroPad = function(s,l) {
        while (s.length < l) s = '0' + s;
        return s;
    };
    var toHex = function(i) {
        return '0x' + zeroPad(i.toString(16), 2);
    };
    var toBin = function(i) {
        return zeroPad(i.toString(2), 8);
    };

    var turing_methods = {
        init:function(options){
            this.options = $.extend({}, options);
            var $this=$(this);
            $this.data('head_position',null);
            $this.turing('addCell',0);
        },
        addCell:function(value){
            var $this=$(this),
                cell=$this.turing('newCell',value);
            if (!$this.data('head_position')) {
                $this.turing('selectCell',cell);
            }
            $this.append(cell);
            return cell;
        },
        newCell:function(value){
            var cell=$('<div>').addClass('cell').data('value', parseInt(value || 0));
            $(this).turing('drawCell', cell);
            return cell;
        },
        drawCell:function(cell){
            var $cell = $(cell),
                $this=$(this),
                val=$cell.data('value')||0;
            $cell.html('');
            $cell.append(
                $('<div>').addClass('decimal').html((val).toString()),
                $('<span>').addClass('ascii').html(toAscii(val)),' ',
                $('<span>').addClass('hex').html(toHex(val)),' ',
                $('<span>').addClass('bin').html(toBin(val))
            );
        },
        selectCell:function(cell){
            var $this=this;
            $this.data('head_position',cell);
            $('.cell',$this).removeClass('current');
            cell.addClass('current');

            //$parentDiv.scrollTop($parentDiv.scrollTop() + $innerListItem.position().top
            // - $parentDiv.height()/2 + $innerListItem.height()/2);
            $this.scrollLeft($this.scrollLeft() + cell.position().left - $this.width()/2 + cell.width()/2);
            //$this.scrollTop($this.scrollTop() + cell.position().top - $this.height()/2 + cell.height()/2);

        },
        opSet:function(cell,value){
            if (cell === undefined || !cell) {
                cell = $(this).data('head_position');
            }
            $(cell).data('value', parseInt(value || 0));
            $(this).turing('drawCell', cell);
        },
        opGet:function(cell){
            if (cell === undefined || !cell) {
                cell = $(this).data('head_position');
            }
            return $(cell).data('value');
        },
        opIncrement:function(){
            var $this = $(this),
                cell=$this.data('head_position');
            return $this.turing('opSet', cell, mod($this.turing('opGet', cell) + 1, 256));
        },
        opDecrement:function(){
            var $this = $(this),
                cell=$this.data('head_position');
            return $this.turing('opSet', cell, mod($this.turing('opGet', cell) - 1, 256));
        },
        opGoPrev:function(){
            var $this = $(this),
                cell = $this.data('head_position'),
                prev = cell.prev();
            if (prev.length == 0) {
                prev = $this.turing('newCell',0);
                $this.prepend(prev);
            }
            $this.turing('selectCell',prev);
        },
        opGoNext:function(){
            var $this = $(this),
                cell = $this.data('head_position'),
                next = cell.next();
            if (next.length == 0) {
                next = $this.turing('newCell',0);
                $this.append(next);
            }
            $this.turing('selectCell',next);
        }

    };

    /**
     * Turing machine plugin for jQuery
     * @param arg
     * @return {Object}
     */
    $.fn.turing = function(arg) {
        if (typeof arg === 'string') {
            if (turing_methods[arg] !== undefined) {
                return turing_methods[arg].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else {
                $.error("Unknown method "+arg);
            }
        }
        else {
            return turing_methods.init.apply(this, arguments);
        }
    }

})(jQuery);
