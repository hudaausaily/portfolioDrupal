/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.contentTranslationDependentOptions = {
    attach: function attach(context) {
      var $context = $(context);
      var options = drupalSettings.contentTranslationDependentOptions;
      var $fields;
      function fieldsChangeHandler($fields, dependentColumns) {
        return function (e) {
          Drupal.behaviors.contentTranslationDependentOptions.check($fields, dependentColumns, $(e.target));
        };
      }
      if (options && options.dependent_selectors) {
        Object.keys(options.dependent_selectors).forEach(function (field) {
          $fields = $context.find("input[name^=\"".concat(field, "\"]"));
          var dependentColumns = options.dependent_selectors[field];
          $fields.on('change', fieldsChangeHandler($fields, dependentColumns));
          Drupal.behaviors.contentTranslationDependentOptions.check($fields, dependentColumns);
        });
      }
    },
    check: function check($fields, dependentColumns, $changed) {
      var $element = $changed;
      var column;
      function filterFieldsList(index, field) {
        return field.value === column;
      }
      Object.keys(dependentColumns || {}).forEach(function (index) {
        column = dependentColumns[index];
        if (!$changed) {
          $element = $fields.filter(filterFieldsList);
        }
        if ($element.is("input[value=\"".concat(column, "\"]:checked"))) {
          $fields.prop('checked', true).not($element).prop('disabled', true);
        } else {
          $fields.prop('disabled', false);
        }
      });
    }
  };
  Drupal.behaviors.contentTranslation = {
    attach: function attach(context) {
      once('translation-entity-admin-hide', $(context).find('table .bundle-settings .translatable :input')).forEach(function (input) {
        var $input = $(input);
        var $bundleSettings = $input.closest('.bundle-settings');
        if (!$input.is(':checked')) {
          $bundleSettings.nextUntil('.bundle-settings').hide();
        } else {
          $bundleSettings.nextUntil('.bundle-settings', '.field-settings').find('.translatable :input:not(:checked)').closest('.field-settings').nextUntil(':not(.column-settings)').hide();
        }
      });
      $(once('translation-entity-admin-bind', 'body')).on('click', 'table .bundle-settings .translatable :input', function (e) {
        var $target = $(e.target);
        var $bundleSettings = $target.closest('.bundle-settings');
        var $settings = $bundleSettings.nextUntil('.bundle-settings');
        var $fieldSettings = $settings.filter('.field-settings');
        if ($target.is(':checked')) {
          $bundleSettings.find('.operations :input[name$="[language_alterable]"]').prop('checked', true);
          $fieldSettings.find('.translatable :input').prop('checked', true);
          $settings.show();
        } else {
          $settings.hide();
        }
      }).on('click', 'table .field-settings .translatable :input', function (e) {
        var $target = $(e.target);
        var $fieldSettings = $target.closest('.field-settings');
        var $columnSettings = $fieldSettings.nextUntil('.field-settings, .bundle-settings');
        if ($target.is(':checked')) {
          $columnSettings.show();
        } else {
          $columnSettings.hide();
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings);