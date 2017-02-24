/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * TODO: 
 *  1) Add support for mobile.
 *  2) Support resizing diagonally.
 */

/**
 * jwResizer Resize Manager
 * @constructor
 * @description Auxiliary class, that manages drag/resize for HTMLElements. Part of jasonwidgets.com
 */
function jwResizer(htmlElement, options) {
    this.options = options ? options : {};
    if (!this.options.margins) {
        this.options.margins = 5;
    }
    if (!this.options.minWidth) {
        this.options.minWidth = 30;
    }
    if (!this.options.minHeight) {
        this.options.minHeight = 30;
    }
    this._mouseMoveEvent = null;
    this.htmlElement = htmlElement;
    this._mousePositionInfo = {
        onTopEdge: false,
        onLeftEdge: false,
        onRightEdge: false,
        onBottomEdge: false,
        mousePixelsDifferenceLeft: null,
        mousePixelsDifferenceTop: null,
        mousePixelsDifferenceBottom: null,
        mousePixelsDifferenceRight:null,
        elementRect: null,
        canResize:false
    }
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._monitorCanvas = this._monitorCanvas.bind(this);
    this._resizing = false;
    this._updatingMouseInfo = false;
    this._initializeEvents();
    this._monitorCanvas();
}

/**
 * Mouse move event.
 */
jwResizer.prototype._onMouseMove = function (event) {
    this._mouseMoveEvent = event;
}

/**
 * Mouse down event.
 */
jwResizer.prototype._onMouseDown = function (event) {
    this._resizing = this._mousePositionInfo.canResize;
}

/**
 * Mouse up event.
 */
jwResizer.prototype._onMouseUp = function (event) {
    this._resizing = false;
}

/**
 * Function running within a requestAnimationFrame, to improve performance and reduce flickering while resizing.
 */
jwResizer.prototype._monitorCanvas = function () {
    window.requestAnimationFrame(this._monitorCanvas);
    if (this._resizing) {
        var newWidthDifference = 0;
        var newHeightDifference = 0;
        var newWidth = 0;
        var newLeft = 0;
        var newTop = 0;
        var newHeight = 0;
        if (this._mousePositionInfo.onRightEdge) {
            //we want to resize the element, if it the difference between the mouse cursor and the right side of the element, is bigger than the configured margins.
            //margins define the pixel "sensitivity" of the resize. Margin "sensitivity" is divided by two, half on each side of the element
            newWidthDifference = ((this._mouseMoveEvent.clientX + this.options.margins / 2) - this._mousePositionInfo.elementRect.right);
            if (Math.abs(newWidthDifference) > this.options.margins) {
                newWidth = this._mousePositionInfo.elementRect.width + newWidthDifference;
                if (newWidth >= this.options.minWidth) {
                    this.htmlElement.style.width = newWidth + "px";
                }
            }
        }
        if (this._mousePositionInfo.onLeftEdge) {
            //we want to resize the element, if it the difference between the mouse cursor and the right side of the element, is bigger than the configured margins.
            //margins define the pixel "sensitivity" of the resize. Margin "sensitivity" is divided by two, half on each side of the element
            newWidthDifference = ((this._mouseMoveEvent.clientX + this.options.margins / 2) - this._mousePositionInfo.elementRect.left);
            if (Math.abs(newWidthDifference) > this.options.margins) {
                newWidth = this._mousePositionInfo.elementRect.width - newWidthDifference;
                newLeft = this._mousePositionInfo.elementRect.left + newWidthDifference;
                if (newWidth >= this.options.minWidth) {
                    this.htmlElement.style.width = newWidth + "px";
                    this.htmlElement.style.left = newLeft + "px";
                }
            }
        }

        if (this._mousePositionInfo.onTopEdge) {
            //we want to resize the element, if it the difference between the mouse cursor and the right side of the element, is bigger than the configured margins.
            //margins define the pixel "sensitivity" of the resize. Margin "sensitivity" is divided by two, half on each side of the element
            newHeightDifference = ((this._mouseMoveEvent.clientY + this.options.margins / 2) - this._mousePositionInfo.elementRect.top);
            if (Math.abs(newHeightDifference) > this.options.margins) {
                newHeight = this._mousePositionInfo.elementRect.height - newHeightDifference;
                newTop = this._mousePositionInfo.elementRect.top + newHeightDifference;
                if (newHeight >= this.options.minHeight) {
                    this.htmlElement.style.height = newHeight + "px";
                    this.htmlElement.style.top = newTop + "px";
                }
            }
        }

        if (this._mousePositionInfo.onBottomEdge) {
            //we want to resize the element, if it the difference between the mouse cursor and the right side of the element, is bigger than the configured margins.
            //margins define the pixel "sensitivity" of the resize. Margin "sensitivity" is divided by two, half on each side of the element
            newHeightDifference = ((this._mouseMoveEvent.clientY + this.options.margins / 2) - this._mousePositionInfo.elementRect.bottom);
            if (Math.abs(newHeightDifference) > this.options.margins) {
                newHeight = this._mousePositionInfo.elementRect.bottom + newHeightDifference;
                if (newHeight >= this.options.minHeight) {
                    this.htmlElement.style.height = newHeight + "px";
                }
            }
        }
    }
    else {
        if (this._mouseMoveEvent) {
            this.update_mousePositionInfo(this._mouseMoveEvent);
            var cursor = "default";
            if (this._mousePositionInfo.onLeftEdge || this._mousePositionInfo.onRightEdge) {
                cursor = "ew-resize";
            }
            if (this._mousePositionInfo.onTopEdge || this._mousePositionInfo.onBottomEdge) {
                cursor = "ns-resize";
            }
            this.htmlElement.style.cursor = cursor;
        }
    }
}

/**
 * Calculates mouse position information in relation to the htmlElement.
 */
jwResizer.prototype.update_mousePositionInfo = function (event) {
    var elementRect = this.htmlElement.getBoundingClientRect();
    this._mousePositionInfo.elementRect = elementRect;
    this._mousePositionInfo.mousePixelsDifferenceLeft = Math.abs(event.clientX - elementRect.left);
    this._mousePositionInfo.mousePixelsDifferenceTop = Math.abs(event.clientY - elementRect.top);
    this._mousePositionInfo.mousePixelsDifferenceBottom = Math.abs(event.clientY - elementRect.bottom);
    this._mousePositionInfo.mousePixelsDifferenceRight = Math.abs(event.clientX - elementRect.right);

    this._mousePositionInfo.onTopEdge = this._mousePositionInfo.mousePixelsDifferenceTop <= this.options.margins;
    this._mousePositionInfo.onLeftEdge = this._mousePositionInfo.mousePixelsDifferenceLeft <= this.options.margins;

    this._mousePositionInfo.onBottomEdge = this._mousePositionInfo.mousePixelsDifferenceBottom <= this.options.margins;
    this._mousePositionInfo.onRightEdge = this._mousePositionInfo.mousePixelsDifferenceRight <= this.options.margins;
    this._mousePositionInfo.canResize = this._mousePositionInfo.onTopEdge || this._mousePositionInfo.onLeftEdge || this._mousePositionInfo.onBottomEdge || this._mousePositionInfo.onRightEdge;
}

/**
 * Initializes events.
 */
jwResizer.prototype._initializeEvents = function () {
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mousedown", this._onMouseDown);
    window.addEventListener("mouseup", this._onMouseUp);
}

/**
 * Removes event listeners.
 */
jwResizer.prototype.destroy = function () {
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mousedown", this._onMouseDown);
    window.removeEventListener("mouseup", this._onMouseUp);
}

