'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _filters = require('./filters');

var _index = require('./internal/index');

var _utils = require('./utils');

var _builtins = require('./builtins');

var _index2 = require('./components/index');

var _primitives = require('./primitives');

var _styles = require('./styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultProps = exports.defaultProps = {
  backspaceRemovesValue: true,
  blurInputOnSelect: (0, _utils.isTouchCapable)(),
  captureMenuScroll: !(0, _utils.isTouchCapable)(),
  closeMenuOnSelect: true,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: (0, _filters.createFilter)(),
  formatGroupLabel: _builtins.formatGroupLabel,
  getOptionLabel: _builtins.getOptionLabel,
  getOptionValue: _builtins.getOptionValue,
  hideSelectedOptions: true,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: _builtins.isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !(0, _utils.isMobileDevice)(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return count + ' result' + (count !== 1 ? 's' : '') + ' available.';
  },
  styles: {},
  tabIndex: '0',
  tabSelectsValue: true
};

var instanceId = 1;

var Select = function (_Component) {
  _inherits(Select, _Component);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    var value = props.value;

    _this.components = (0, _index2.defaultComponents)(props);
    _this.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);

    var selectValue = (0, _utils.cleanValue)(value);
    var menuOptions = _this.buildMenuOptions(props, selectValue);

    _this.state.menuOptions = menuOptions;
    _this.state.selectValue = selectValue;
    return _this;
  } // TODO


  _createClass(Select, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.startListeningToTouch();

      if (this.props.autoFocus) {
        this.focusInput();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          components = _props.components,
          options = _props.options,
          value = _props.value,
          inputValue = _props.inputValue;
      // re-cache custom components

      if (nextProps.components !== components) {
        this.components = (0, _index2.defaultComponents)(nextProps);
      }
      // rebuild the menu options
      if (nextProps.value !== value || nextProps.options !== options || nextProps.inputValue !== inputValue) {
        var _selectValue = (0, _utils.cleanValue)(nextProps.value);
        var _menuOptions = this.buildMenuOptions(nextProps, _selectValue);
        var _focusedValue = this.getNextFocusedValue(_selectValue);
        var _focusedOption = this.getNextFocusedOption(_menuOptions.focusable);
        this.setState({ menuOptions: _menuOptions, selectValue: _selectValue, focusedOption: _focusedOption, focusedValue: _focusedValue });
      }
      // some updates should toggle the state of the input visibility
      if (this.inputIsHiddenAfterUpdate != null) {
        this.setState({
          inputIsHidden: this.inputIsHiddenAfterUpdate
        });
        delete this.inputIsHiddenAfterUpdate;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          isDisabled = _props2.isDisabled,
          menuIsOpen = _props2.menuIsOpen;
      var isFocused = this.state.isFocused;


      if (
      // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled ||
      // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      }

      // scroll the focused option into view if necessary
      if (this.menuRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        (0, _utils.scrollIntoView)(this.menuRef, this.focusedOptionRef);
      }
      this.scrollToFocusedOptionOnUpdate = false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stopListeningToTouch();
    }

    // ==============================
    // Element Refs
    // ==============================

  }, {
    key: 'onMenuOpen',


    // ==============================
    // Consumer Handlers
    // ==============================

    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: 'onMenuClose',
    value: function onMenuClose() {
      this.onInputChange('', { action: 'menu-close' });
      this.props.onMenuClose();
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    }

    // ==============================
    // Methods
    // ==============================

  }, {
    key: 'focusInput',
    value: function focusInput() {
      if (!this.input) return;
      this.input.focus();
    }
  }, {
    key: 'blurInput',
    value: function blurInput() {
      if (!this.input) return;
      this.input.blur();
    }

    // aliased for consumers

  }, {
    key: 'openMenu',
    value: function openMenu(focusOption) {
      var _state = this.state,
          menuOptions = _state.menuOptions,
          selectValue = _state.selectValue;
      var isMulti = this.props.isMulti;


      var openAtIndex = focusOption === 'first' ? 0 : menuOptions.focusable.length - 1;

      if (!isMulti) {
        var selectedIndex = menuOptions.focusable.indexOf(selectValue[0]);
        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      }

      this.scrollToFocusedOptionOnUpdate = true;
      this.inputIsHiddenAfterUpdate = false;
      this.onMenuOpen();
      this.setState({
        focusedValue: null,
        focusedOption: menuOptions.focusable[openAtIndex]
      });
    }
  }, {
    key: 'focusValue',
    value: function focusValue(direction) {
      var isMulti = this.props.isMulti;
      var _state2 = this.state,
          selectValue = _state2.selectValue,
          focusedValue = _state2.focusedValue;

      // Only multiselects support value focusing

      if (!isMulti) return;

      this.setState({
        focusedOption: null
      });

      var focusedIndex = focusedValue ? selectValue.indexOf(focusedValue) : -1;
      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;

      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }
          break;
        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }
          break;
      }

      this.setState({
        inputIsHidden: nextFocus === -1 ? false : true,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: 'focusOption',
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var _state3 = this.state,
          focusedOption = _state3.focusedOption,
          menuOptions = _state3.menuOptions;

      var options = menuOptions.focusable;

      if (!options.length) return;
      var nextFocus = 0; // handles 'first'
      var focusedIndex = focusedOption ? options.indexOf(focusedOption) : -1;
      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }
      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null
      });
    }
  }, {
    key: 'getCommonProps',


    // ==============================
    // Getters
    // ==============================

    value: function getCommonProps() {
      var clearValue = this.clearValue,
          getStyles = this.getStyles,
          setValue = this.setValue,
          selectOption = this.selectOption,
          props = this.props;
      var className = props.className,
          classNamePrefix = props.classNamePrefix,
          isMulti = props.isMulti,
          isRtl = props.isRtl,
          options = props.options;
      var selectValue = this.state.selectValue;

      var hasValue = this.hasValue();
      var getValue = function getValue() {
        return selectValue;
      };
      var cxPrefix = classNamePrefix;
      if (className && classNamePrefix === undefined) {
        console.warn('\n        Warning: the behaviour of \'className\' has changed between 2.0.0-beta.2 and 2.0.0-beta.3.\n        You can now use className to specify the class name of the outer container, and classNamePrefix to enable our provided BEM class names for internal elements.\n        The className prop will have no effect on internal elements when 2.0.0 is released.\n      ');
        cxPrefix = className;
      }

      var cx = _utils.classNames.bind(null, cxPrefix);
      return {
        cx: cx,
        clearValue: clearValue,
        getStyles: getStyles,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        setValue: setValue,
        selectProps: props
      };
    }
  }, {
    key: 'getNextFocusedValue',
    value: function getNextFocusedValue(nextSelectValue) {
      if (this.clearFocusValueOnUpdate) {
        this.clearFocusValueOnUpdate = false;
        return null;
      }
      var _state4 = this.state,
          focusedValue = _state4.focusedValue,
          lastSelectValue = _state4.selectValue;

      var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);
      if (lastFocusedIndex > -1) {
        var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);
        if (nextFocusedIndex > -1) {
          // the focused value is still in the selectValue, return it
          return focusedValue;
        } else if (lastFocusedIndex < nextSelectValue.length) {
          // the focusedValue is not present in the next selectValue array by
          // reference, so return the new value at the same index
          return nextSelectValue[lastFocusedIndex];
        }
      }
      return null;
    }
  }, {
    key: 'getNextFocusedOption',
    value: function getNextFocusedOption(options) {
      var lastFocusedOption = this.state.focusedOption;

      return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
    }
  }, {
    key: 'getOptionLabel',
    value: function getOptionLabel(data) {
      return this.props.getOptionLabel(data);
    }
  }, {
    key: 'getOptionValue',
    value: function getOptionValue(data) {
      return this.props.getOptionValue(data);
    }
  }, {
    key: 'hasValue',


    // ==============================
    // Helpers
    // ==============================

    value: function hasValue() {
      var selectValue = this.state.selectValue;

      return selectValue.length > 0;
    }
  }, {
    key: 'hasOptions',
    value: function hasOptions() {
      return !!this.state.menuOptions.render.length;
    }
  }, {
    key: 'countOptions',
    value: function countOptions() {
      return this.state.menuOptions.focusable.length;
    }
  }, {
    key: 'isClearable',
    value: function isClearable() {
      var _props3 = this.props,
          isClearable = _props3.isClearable,
          isMulti = _props3.isMulti;

      // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable

      if (isClearable === undefined) return isMulti;

      return isClearable;
    }
  }, {
    key: 'isOptionDisabled',
    value: function isOptionDisabled(option) {
      return typeof this.props.isOptionDisabled === 'function' ? this.props.isOptionDisabled(option) : false;
    }
  }, {
    key: 'isOptionSelected',
    value: function isOptionSelected(option, selectValue) {
      var _this2 = this;

      if (selectValue.indexOf(option) > -1) return true;
      if (typeof this.props.isOptionSelected === 'function') {
        return this.props.isOptionSelected(option, selectValue);
      }
      var candidate = this.getOptionValue(option);
      return selectValue.some(function (i) {
        return _this2.getOptionValue(i) === candidate;
      });
    }
  }, {
    key: 'filterOption',
    value: function filterOption(option, inputValue) {
      return this.props.filterOption ? this.props.filterOption(option, inputValue) : true;
    }
  }, {
    key: 'formatOptionLabel',
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var _inputValue = this.props.inputValue;
        var _selectValue2 = this.state.selectValue;

        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: _inputValue,
          selectValue: _selectValue2
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: 'formatGroupLabel',
    value: function formatGroupLabel(data) {
      return this.props.formatGroupLabel(data);
    }

    // ==============================
    // Mouse Handlers
    // ==============================

  }, {
    key: 'startListeningToTouch',


    // ==============================
    // Touch Handlers
    // ==============================

    value: function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: 'stopListeningToTouch',
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }

    // ==============================
    // Focus Handlers
    // ==============================

    // ==============================
    // Keyboard Handlers
    // ==============================

  }, {
    key: 'buildMenuOptions',


    // ==============================
    // Menu Options
    // ==============================

    value: function buildMenuOptions(props, selectValue) {
      var _this3 = this;

      var hideSelectedOptions = props.hideSelectedOptions,
          isMulti = props.isMulti,
          _props$inputValue = props.inputValue,
          inputValue = _props$inputValue === undefined ? '' : _props$inputValue,
          options = props.options;


      var toOption = function toOption(option, id) {
        var isDisabled = _this3.isOptionDisabled(option);
        var isSelected = _this3.isOptionSelected(option, selectValue);
        var label = _this3.getOptionLabel(option);
        var value = _this3.getOptionValue(option);

        if (isMulti && hideSelectedOptions && isSelected || !_this3.filterOption({ label: label, value: value, data: option }, inputValue)) {
          return;
        }

        var onHover = isDisabled ? undefined : function () {
          return _this3.onOptionHover(option);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this3.selectOption(option);
        };
        var optionId = _this3.getElementId('option') + '-' + id;

        return {
          innerProps: {
            'aria-selected': isSelected,
            id: optionId,
            onClick: onSelect,
            onMouseMove: onHover,
            onMouseOver: onHover,
            role: 'option',
            tabIndex: -1
          },
          data: option,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: 'option',
          value: value
        };
      };

      return options.reduce(function (acc, item, itemIndex) {
        if (item.options) {
          // TODO needs a tidier implementation
          if (!_this3.hasGroups) _this3.hasGroups = true;

          var items = item.options;

          var children = items.map(function (child, i) {
            var option = toOption(child, itemIndex + '-' + i);
            if (option && !option.isDisabled) acc.focusable.push(child);
            return option;
          }).filter(Boolean);
          if (children.length) {
            var groupId = _this3.getElementId('group') + '-' + itemIndex;
            acc.render.push({
              type: 'group',
              key: groupId,
              data: item,
              options: children
            });
          }
        } else {
          var option = toOption(item, '' + itemIndex);
          if (option) {
            acc.render.push(option);
            if (!option.isDisabled) acc.focusable.push(item);
          }
        }
        return acc;
      }, { render: [], focusable: [] });
    }

    // ==============================
    // Renderers
    // ==============================

  }, {
    key: 'renderScreenReaderStatus',
    value: function renderScreenReaderStatus() {
      var screenReaderStatus = this.props.screenReaderStatus;

      return _react2.default.createElement(
        _primitives.A11yText,
        { 'aria-atomic': 'true', 'aria-live': 'polite', role: 'status' },
        screenReaderStatus({ count: this.countOptions() })
      );
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _props4 = this.props,
          isDisabled = _props4.isDisabled,
          isLoading = _props4.isLoading,
          isSearchable = _props4.isSearchable,
          inputId = _props4.inputId,
          inputValue = _props4.inputValue,
          menuIsOpen = _props4.menuIsOpen,
          tabIndex = _props4.tabIndex;
      var Input = this.components.Input;
      var inputIsHidden = this.state.inputIsHidden;


      var id = inputId || this.getElementId('input');

      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return _react2.default.createElement(_index.DummyInput, {
          id: id,
          innerRef: this.onInputRef,
          onBlur: this.onInputBlur,
          onChange: _utils.noop,
          onFocus: this.onInputFocus,
          readOnly: true,
          tabIndex: tabIndex,
          value: ''
        });
      }

      // aria attributes makes the JSX "noisy", separated for clarity
      var ariaAttributes = {
        'aria-activedescendant': this.getActiveDescendentId(),
        'aria-autocomplete': 'list',
        'aria-busy': isLoading,
        'aria-describedby': this.props['aria-describedby'],
        'aria-expanded': menuIsOpen,
        'aria-haspopup': menuIsOpen,
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby'],
        'aria-owns': menuIsOpen ? this.getElementId('listbox') : undefined,
        role: 'combobox'
      };

      var cx = this.commonProps.cx;


      return _react2.default.createElement(Input, _extends({
        autoCapitalize: 'none',
        autoComplete: 'off',
        autoCorrect: 'off',
        cx: cx,
        getStyles: this.getStyles,
        id: id,
        innerRef: this.onInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        spellCheck: 'false',
        tabIndex: tabIndex,
        type: 'text',
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: 'renderPlaceholderOrValue',
    value: function renderPlaceholderOrValue() {
      var _this4 = this;

      var _components = this.components,
          MultiValue = _components.MultiValue,
          MultiValueContainer = _components.MultiValueContainer,
          MultiValueLabel = _components.MultiValueLabel,
          MultiValueRemove = _components.MultiValueRemove,
          SingleValue = _components.SingleValue,
          Placeholder = _components.Placeholder;
      var commonProps = this.commonProps;
      var _props5 = this.props,
          controlShouldRenderValue = _props5.controlShouldRenderValue,
          isDisabled = _props5.isDisabled,
          isMulti = _props5.isMulti,
          inputValue = _props5.inputValue,
          placeholder = _props5.placeholder;
      var _state5 = this.state,
          selectValue = _state5.selectValue,
          focusedValue = _state5.focusedValue;


      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : _react2.default.createElement(
          Placeholder,
          _extends({}, commonProps, { key: 'placeholder', isDisabled: isDisabled }),
          placeholder
        );
      }

      if (isMulti) {
        return selectValue.map(function (opt) {
          var isFocused = opt === focusedValue;
          return _react2.default.createElement(
            MultiValue,
            _extends({}, commonProps, {
              components: {
                Container: MultiValueContainer,
                Label: MultiValueLabel,
                Remove: MultiValueRemove
              },
              isFocused: isFocused,
              isDisabled: isDisabled,
              key: _this4.getOptionValue(opt),
              removeProps: {
                onClick: function onClick() {
                  return _this4.removeValue(opt);
                },
                onMouseDown: function onMouseDown(e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              },
              data: opt
            }),
            _this4.formatOptionLabel(opt, 'value')
          );
        });
      }

      if (inputValue) {
        return null;
      }

      var singleValue = selectValue[0];
      return _react2.default.createElement(
        SingleValue,
        _extends({}, commonProps, { data: singleValue, isDisabled: isDisabled }),
        this.formatOptionLabel(singleValue, 'value')
      );
    }
  }, {
    key: 'renderClearIndicator',
    value: function renderClearIndicator() {
      var ClearIndicator = this.components.ClearIndicator;
      var commonProps = this.commonProps;
      var _props6 = this.props,
          isDisabled = _props6.isDisabled,
          isLoading = _props6.isLoading;
      var isFocused = this.state.isFocused;


      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }

      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        role: 'button'
      };

      return _react2.default.createElement(ClearIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderLoadingIndicator',
    value: function renderLoadingIndicator() {
      var LoadingIndicator = this.components.LoadingIndicator;
      var commonProps = this.commonProps;
      var _props7 = this.props,
          isDisabled = _props7.isDisabled,
          isLoading = _props7.isLoading;
      var isFocused = this.state.isFocused;


      if (!LoadingIndicator || !isLoading) return null;

      var innerProps = {
        role: 'presentation'
      };

      return _react2.default.createElement(LoadingIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderIndicatorSeparator',
    value: function renderIndicatorSeparator() {
      var _components2 = this.components,
          DropdownIndicator = _components2.DropdownIndicator,
          IndicatorSeparator = _components2.IndicatorSeparator;

      // separator doesn't make sense without the dropdown indicator

      if (!DropdownIndicator || !IndicatorSeparator) return null;

      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;

      var innerProps = { role: 'presentation' };

      return _react2.default.createElement(IndicatorSeparator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderDropdownIndicator',
    value: function renderDropdownIndicator() {
      var DropdownIndicator = this.components.DropdownIndicator;

      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;


      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        role: 'button'
      };

      return _react2.default.createElement(DropdownIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderMenu',
    value: function renderMenu() {
      var _this5 = this;

      var _components3 = this.components,
          Group = _components3.Group,
          GroupHeading = _components3.GroupHeading,
          Menu = _components3.Menu,
          MenuList = _components3.MenuList,
          MenuPortal = _components3.MenuPortal,
          LoadingMessage = _components3.LoadingMessage,
          NoOptionsMessage = _components3.NoOptionsMessage,
          Option = _components3.Option;
      var commonProps = this.commonProps;
      var _state6 = this.state,
          focusedOption = _state6.focusedOption,
          menuOptions = _state6.menuOptions;
      var _props8 = this.props,
          captureMenuScroll = _props8.captureMenuScroll,
          inputValue = _props8.inputValue,
          isLoading = _props8.isLoading,
          isMulti = _props8.isMulti,
          loadingMessage = _props8.loadingMessage,
          minMenuHeight = _props8.minMenuHeight,
          maxMenuHeight = _props8.maxMenuHeight,
          menuIsOpen = _props8.menuIsOpen,
          menuPlacement = _props8.menuPlacement,
          menuPosition = _props8.menuPosition,
          menuPortalTarget = _props8.menuPortalTarget,
          menuShouldBlockScroll = _props8.menuShouldBlockScroll,
          menuShouldScrollIntoView = _props8.menuShouldScrollIntoView,
          noOptionsMessage = _props8.noOptionsMessage,
          onMenuScrollToTop = _props8.onMenuScrollToTop,
          onMenuScrollToBottom = _props8.onMenuScrollToBottom;


      if (!menuIsOpen) return null;

      // TODO: Internal Option Type here
      var render = function render(props) {
        // for performance, the menu options in state aren't changed when the
        // focused option changes so we calculate additional props based on that
        var isFocused = focusedOption === props.data;
        props.innerProps.innerRef = isFocused ? _this5.onFocusedOptionRef : undefined;

        return _react2.default.createElement(
          Option,
          _extends({}, commonProps, props, { isFocused: isFocused }),
          _this5.formatOptionLabel(props.data, 'menu')
        );
      };

      var menuUI = void 0;

      if (!this.hasOptions() && noOptionsMessage === null) {
        return null;
      }

      if (this.hasOptions()) {
        menuUI = menuOptions.render.map(function (item) {
          if (item.type === 'group') {
            var type = item.type,
                group = _objectWithoutProperties(item, ['type']);

            var headingId = item.key + '-heading';

            return _react2.default.createElement(
              Group,
              _extends({}, commonProps, group, {
                Heading: GroupHeading,
                innerProps: {
                  'aria-expanded': true,
                  'aria-labelledby': headingId,
                  role: 'group'
                },
                headingProps: {
                  id: headingId
                },
                label: _this5.formatGroupLabel(item.data)
              }),
              item.options.map(function (option) {
                return render(option);
              })
            );
          } else if (item.type === 'option') {
            return render(item);
          }
        });
      } else if (isLoading) {
        menuUI = _react2.default.createElement(
          LoadingMessage,
          commonProps,
          loadingMessage({ inputValue: inputValue })
        );
      } else {
        menuUI = _react2.default.createElement(
          NoOptionsMessage,
          commonProps,
          noOptionsMessage({ inputValue: inputValue })
        );
      }

      var menuElement = _react2.default.createElement(
        'div',
        null,
        menuShouldBlockScroll ? _react2.default.createElement(_index.ScrollBlock, null) : null,
        _react2.default.createElement(
          Menu,
          _extends({}, commonProps, {
            innerProps: {
              onMouseDown: this.onMenuMouseDown,
              onMouseMove: this.onMenuMouseMove
            },
            isLoading: isLoading,
            minMenuHeight: minMenuHeight,
            maxMenuHeight: maxMenuHeight,
            menuPlacement: menuPlacement,
            menuPosition: menuPosition,
            menuShouldScrollIntoView: menuShouldScrollIntoView
          }),
          _react2.default.createElement(
            _index.ScrollCaptor,
            {
              isEnabled: captureMenuScroll,
              onTopArrive: onMenuScrollToTop,
              onBottomArrive: onMenuScrollToBottom
            },
            _react2.default.createElement(
              MenuList,
              _extends({}, commonProps, {
                innerProps: {
                  'aria-multiselectable': isMulti,
                  id: this.getElementId('listbox'),
                  innerRef: this.onMenuRef,
                  role: 'listbox'
                },
                isLoading: isLoading,
                maxHeight: maxMenuHeight
              }),
              menuUI
            )
          )
        )
      );

      // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`
      return menuPortalTarget || menuPosition === 'fixed' ? _react2.default.createElement(
        MenuPortal,
        _extends({}, commonProps, {
          appendTo: menuPortalTarget,
          controlElement: this.controlRef,
          menuPlacement: menuPlacement,
          menuPosition: menuPosition
        }),
        menuElement
      ) : menuElement;
    }
  }, {
    key: 'renderFormField',
    value: function renderFormField() {
      var _this6 = this;

      var _props9 = this.props,
          delimiter = _props9.delimiter,
          isDisabled = _props9.isDisabled,
          isMulti = _props9.isMulti,
          name = _props9.name;
      var selectValue = this.state.selectValue;


      if (!name || isDisabled) return;

      if (isMulti) {
        if (delimiter) {
          var _value = selectValue.map(function (opt) {
            return _this6.getOptionValue(opt);
          }).join(delimiter);
          return _react2.default.createElement('input', { name: name, type: 'hidden', value: _value });
        } else {
          return _react2.default.createElement(
            'div',
            null,
            selectValue.map(function (opt, i) {
              return _react2.default.createElement('input', {
                key: 'i-' + i,
                name: name,
                type: 'hidden',
                value: _this6.getOptionValue(opt)
              });
            })
          );
        }
      } else {
        var _value2 = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
        return _react2.default.createElement('input', { name: name, type: 'hidden', value: _value2 });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _components4 = this.components,
          Control = _components4.Control,
          IndicatorsContainer = _components4.IndicatorsContainer,
          SelectContainer = _components4.SelectContainer,
          ValueContainer = _components4.ValueContainer;
      var _props10 = this.props,
          className = _props10.className,
          id = _props10.id,
          isDisabled = _props10.isDisabled;
      var isFocused = this.state.isFocused;


      var commonProps = this.commonProps = this.getCommonProps();

      return _react2.default.createElement(
        SelectContainer,
        _extends({}, commonProps, {
          className: className,
          innerProps: {
            id: id,
            onKeyDown: this.onKeyDown
          },
          isDisabled: isDisabled,
          isFocused: isFocused
        }),
        this.renderScreenReaderStatus(),
        _react2.default.createElement(
          Control,
          _extends({}, commonProps, {
            innerProps: {
              innerRef: this.onControlRef,
              onMouseDown: this.onControlMouseDown,
              onTouchEnd: this.onControlTouchEnd
            },
            isDisabled: isDisabled,
            isFocused: isFocused
          }),
          _react2.default.createElement(
            ValueContainer,
            _extends({}, commonProps, { isDisabled: isDisabled }),
            this.renderPlaceholderOrValue(),
            this.renderInput()
          ),
          _react2.default.createElement(
            IndicatorsContainer,
            _extends({}, commonProps, { isDisabled: isDisabled }),
            this.renderClearIndicator(),
            this.renderLoadingIndicator(),
            this.renderIndicatorSeparator(),
            this.renderDropdownIndicator()
          )
        ),
        this.renderMenu(),
        this.renderFormField()
      );
    }
  }]);

  return Select;
}(_react.Component);

Select.defaultProps = defaultProps;

var _initialiseProps = function _initialiseProps() {
  var _this7 = this;

  this.blockOptionHover = false;
  this.clearFocusValueOnUpdate = false;
  this.hasGroups = false;
  this.instancePrefix = '';
  this.initialTouchX = 0;
  this.initialTouchY = 0;
  this.openAfterFocus = false;
  this.scrollToFocusedOptionOnUpdate = false;
  this.state = {
    focusedOption: null,
    focusedValue: null,
    inputIsHidden: false,
    isFocused: false,
    menuOptions: { render: [], focusable: [] },
    selectValue: []
  };

  this.onInputRef = function (ref) {
    _this7.input = ref;
  };

  this.onControlRef = function (ref) {
    _this7.controlRef = ref;
  };

  this.onMenuRef = function (ref) {
    _this7.menuRef = ref;
  };

  this.onFocusedOptionRef = function (ref) {
    _this7.focusedOptionRef = ref;
  };

  this.focus = this.focusInput;
  this.blur = this.blurInput;

  this.setValue = function (newValue) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'set-value';
    var _props11 = _this7.props,
        closeMenuOnSelect = _props11.closeMenuOnSelect,
        isMulti = _props11.isMulti,
        onChange = _props11.onChange;

    _this7.onInputChange('', { action: 'set-value' });
    if (closeMenuOnSelect) {
      _this7.inputIsHiddenAfterUpdate = !isMulti;
      _this7.onMenuClose();
    }
    // when the select value should change, we should reset focusedValue
    _this7.clearFocusValueOnUpdate = true;
    onChange(newValue, { action: action });
  };

  this.selectOption = function (newValue) {
    var _props12 = _this7.props,
        blurInputOnSelect = _props12.blurInputOnSelect,
        isMulti = _props12.isMulti;


    if (isMulti) {
      var _selectValue3 = _this7.state.selectValue;

      if (_this7.isOptionSelected(newValue, _selectValue3)) {
        var candidate = _this7.getOptionValue(newValue);
        _this7.setValue(_selectValue3.filter(function (i) {
          return _this7.getOptionValue(i) !== candidate;
        }), 'deselect-option');
      } else {
        _this7.setValue([].concat(_toConsumableArray(_selectValue3), [newValue]), 'select-option');
      }
    } else {
      _this7.setValue(newValue, 'select-option');
    }

    if (blurInputOnSelect) {
      _this7.blurInput();
    }
  };

  this.removeValue = function (removedValue) {
    var onChange = _this7.props.onChange;
    var selectValue = _this7.state.selectValue;

    var candidate = _this7.getOptionValue(removedValue);
    onChange(selectValue.filter(function (i) {
      return _this7.getOptionValue(i) !== candidate;
    }), {
      action: 'remove-value',
      removedValue: removedValue
    });
    _this7.focusInput();
  };

  this.clearValue = function () {
    var _props13 = _this7.props,
        isMulti = _props13.isMulti,
        onChange = _props13.onChange;

    onChange(isMulti ? [] : null, { action: 'clear' });
  };

  this.popValue = function () {
    var onChange = _this7.props.onChange;
    var selectValue = _this7.state.selectValue;

    onChange(selectValue.slice(0, selectValue.length - 1), {
      action: 'pop-value',
      removedValue: selectValue[selectValue.length - 1]
    });
  };

  this.getStyles = function (key, props) {
    var base = _styles.defaultStyles[key](props);
    base.boxSizing = 'border-box';
    var custom = _this7.props.styles[key];
    return custom ? custom(base, props) : base;
  };

  this.getElementId = function (element) {
    return _this7.instancePrefix + '-' + element;
  };

  this.getActiveDescendentId = function () {
    var menuIsOpen = _this7.props.menuIsOpen;
    var _state7 = _this7.state,
        menuOptions = _state7.menuOptions,
        focusedOption = _state7.focusedOption;


    if (!focusedOption || !menuIsOpen) return undefined;

    var index = menuOptions.focusable.indexOf(focusedOption);
    var option = menuOptions.render[index];

    return option && option.key;
  };

  this.onMenuMouseDown = function (event) {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    _this7.focusInput();
  };

  this.onMenuMouseMove = function (event) {
    _this7.blockOptionHover = false;
  };

  this.onControlMouseDown = function (event) {
    var openMenuOnClick = _this7.props.openMenuOnClick;

    if (!_this7.state.isFocused) {
      if (openMenuOnClick) {
        _this7.openAfterFocus = true;
      }
      _this7.focusInput();
    } else if (!_this7.props.menuIsOpen) {
      _this7.openMenu('first');
    } else {
      _this7.onMenuClose();
    }
    // $FlowFixMe HTMLElement type does not have tagName property
    if (event.target.tagName !== 'INPUT') {
      event.preventDefault();
    }
  };

  this.onDropdownIndicatorMouseDown = function (event) {
    // ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    if (_this7.props.isDisabled) return;
    var _props14 = _this7.props,
        isMulti = _props14.isMulti,
        menuIsOpen = _props14.menuIsOpen;

    _this7.focusInput();
    if (menuIsOpen) {
      _this7.inputIsHiddenAfterUpdate = !isMulti;
      _this7.onMenuClose();
    } else {
      _this7.openMenu('first');
    }
    event.preventDefault();
    event.stopPropagation();
  };

  this.onClearIndicatorMouseDown = function (event) {
    // ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    _this7.clearValue();
    event.stopPropagation();
    _this7.openAfterFocus = false;
    setTimeout(function () {
      return _this7.focusInput();
    });
  };

  this.onTouchStart = function (_ref2) {
    var touches = _ref2.touches;

    var touch = touches[0];
    _this7.initialTouchX = touch.clientX;
    _this7.initialTouchY = touch.clientY;
    _this7.userIsDragging = false;
  };

  this.onTouchMove = function (_ref3) {
    var touches = _ref3.touches;

    var touch = touches[0];
    var deltaX = Math.abs(touch.clientX - _this7.initialTouchX);
    var deltaY = Math.abs(touch.clientY - _this7.initialTouchY);
    var moveThreshold = 5;

    _this7.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
  };

  this.onTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    // close the menu if the user taps outside
    if (_this7.controlRef && !_this7.controlRef.contains(event.target) && _this7.menuRef && !_this7.menuRef.contains(event.target)) {
      _this7.blurInput();
    }

    // reset move vars
    _this7.initialTouchX = 0;
    _this7.initialTouchY = 0;
  };

  this.onControlTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onControlMouseDown(event);
  };

  this.onClearIndicatorTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onClearIndicatorMouseDown(event);
  };

  this.onDropdownIndicatorTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onDropdownIndicatorMouseDown(event);
  };

  this.handleInputChange = function (event) {
    var inputValue = event.currentTarget.value;
    _this7.inputIsHiddenAfterUpdate = false;
    _this7.onInputChange(inputValue, { action: 'input-change' });
    _this7.onMenuOpen();
  };

  this.onInputFocus = function (event) {
    if (_this7.props.onFocus) {
      _this7.props.onFocus(event);
    }
    _this7.inputIsHiddenAfterUpdate = false;
    _this7.setState({
      isFocused: true
    });
    if (_this7.openAfterFocus || _this7.props.openMenuOnFocus) {
      _this7.openMenu('first');
    }
    _this7.openAfterFocus = false;
  };

  this.onInputBlur = function (event) {
    if (_this7.props.onBlur) {
      _this7.props.onBlur(event);
    }
    _this7.onInputChange('', { action: 'input-blur' });
    _this7.onMenuClose();
    _this7.setState({
      focusedValue: null,
      isFocused: false
    });
  };

  this.onOptionHover = function (focusedOption) {
    if (_this7.blockOptionHover || _this7.state.focusedOption === focusedOption) {
      return;
    }
    _this7.setState({ focusedOption: focusedOption });
  };

  this.onKeyDown = function (event) {
    var _props15 = _this7.props,
        isMulti = _props15.isMulti,
        backspaceRemovesValue = _props15.backspaceRemovesValue,
        escapeClearsValue = _props15.escapeClearsValue,
        inputValue = _props15.inputValue,
        isClearable = _props15.isClearable,
        isDisabled = _props15.isDisabled,
        menuIsOpen = _props15.menuIsOpen,
        onKeyDown = _props15.onKeyDown,
        tabSelectsValue = _props15.tabSelectsValue,
        openMenuOnFocus = _props15.openMenuOnFocus;
    var _state8 = _this7.state,
        focusedOption = _state8.focusedOption,
        focusedValue = _state8.focusedValue,
        selectValue = _state8.selectValue;


    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    _this7.blockOptionHover = true;
    switch (event.key) {
      case 'ArrowLeft':
        if (!isMulti || inputValue) return;
        _this7.focusValue('previous');
        break;
      case 'ArrowRight':
        if (!isMulti || inputValue) return;
        _this7.focusValue('next');
        break;
      case 'Backspace':
        if (inputValue) return;
        if (focusedValue) {
          _this7.removeValue(focusedValue);
        } else {
          if (!backspaceRemovesValue) return;
          _this7.popValue();
        }
        break;
      case 'Tab':
        if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption ||
        // don't capture the event if the menu opens on focus and the focused
        // option is already selected; it breaks the flow of navigation
        openMenuOnFocus && _this7.isOptionSelected(focusedOption, selectValue)) {
          return;
        }
        _this7.selectOption(focusedOption);
        break;
      case 'Enter':
        if (menuIsOpen) {
          if (!focusedOption) return;
          _this7.selectOption(focusedOption);
        } else {
          _this7.focusOption('first');
        }
        break;
      case 'Escape':
        if (menuIsOpen) {
          _this7.inputIsHiddenAfterUpdate = false;
          _this7.onInputChange('', { action: 'menu-close' });
          _this7.onMenuClose();
        } else if (isClearable && escapeClearsValue) {
          _this7.clearValue();
        }
        break;
      case ' ':
        // space
        if (inputValue) {
          return;
        }
        if (!menuIsOpen) {
          _this7.openMenu('first');
          break;
        }
        if (!focusedOption) return;
        _this7.selectOption(focusedOption);
        break;
      case 'ArrowUp':
        if (menuIsOpen) {
          _this7.focusOption('up');
        } else {
          _this7.openMenu('last');
        }
        break;
      case 'ArrowDown':
        if (menuIsOpen) {
          _this7.focusOption('down');
        } else {
          _this7.openMenu('first');
        }
        break;
      case 'PageUp':
        if (!menuIsOpen) return;
        _this7.focusOption('pageup');
        break;
      case 'PageDown':
        if (!menuIsOpen) return;
        _this7.focusOption('pagedown');
        break;
      case 'Home':
        if (!menuIsOpen) return;
        _this7.focusOption('first');
        break;
      case 'End':
        if (!menuIsOpen) return;
        _this7.focusOption('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };
};

exports.default = Select;