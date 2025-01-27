/**
 * Plugin Name: orderedTables
 * Description: Este plugin permite que as linhas de uma tabela HTML sejam reordenadas conforme a coluna selecionada, sem repaginar a tela.
 * Uso: Adicione a classe 'table-ordered' às tabelas HTML para ativar o plugin.
 * Dependências: {
 *   jQuery: 1.10.2,
 *   bootstrap-icons: 1.11.3
 * }
 * Autor: Pierre Sanches Alves
 * Copyright: 2024 Pierre Sanches Alves
 * Licença: MIT
 */

var orderedTables = function () {
    $(function () {
        startReorderedTables();
    });
}();

const config = {
    class: {
        backgroud: 'bg-blue',
        ascIcon: 'bi-arrow-down',
        descIcon: 'bi-arrow-up'
    }
};

function startReorderedTables() {
    $('table.table-ordered').each(function () {
        var columnIndex = 0;
        $(this).find('thead tr:nth-child(1) th:not([data-column])').each(function () {
            var colspan = $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1;
            if (colspan > 1) {
                for (var i = 0; i < colspan; i++) {
                    $(this).attr('data-column', columnIndex);
                    columnIndex++;
                }
            } else {
                $(this).attr('data-column', columnIndex);
                columnIndex++;
            }
        });
    });

    $('table.table-ordered thead tr:nth-child(1) th:not([colspan])').off('click').click(function () {
        var columnIndex = $(this).data('column');
        var table = $(this).closest('table');
        var isAsc = $(this).hasClass(config.class.descIcon);

        table.find('th').removeClass(`${config.class.backgroud} ${config.class.ascIcon} ${config.class.descIcon}`);

        $(this).addClass(config.class.backgroud);
        if (isAsc) {
            $(this).addClass(config.class.ascIcon);
        } else {
            $(this).addClass(config.class.descIcon);
        }

        sortTable(table, columnIndex, isAsc);
    });
}

function sortTable(table, columnIndex, isAsc) {
    var rows = table.find('tbody tr').get();

    rows.sort(function (a, b) {
        var A = getCellValue(a, columnIndex);
        var B = getCellValue(b, columnIndex);

        var dateA = parseDate(A);
        var dateB = parseDate(B);

        if (dateA && dateB) {
            return isAsc ? dateB - dateA : dateA - dateB;
        }

        var numA = parseFloat(A);
        var numB = parseFloat(B);

        if (!isNaN(numA) && !isNaN(numB)) {
            return isAsc ? numB - numA : numA - numB;
        } else {
            if (A < B) {
                return isAsc ? 1 : -1;
            }
            if (A > B) {
                return isAsc ? -1 : 1;
            }
            return 0;
        }
    });

    $.each(rows, function (index, row) {
        table.children('tbody').append(row);
    });
}

function getCellValue(row, columnIndex) {
    var cell = $(row).children('td, th').eq(columnIndex);
    return cell.text().replace(/\s+/g, ' ').trim();
}

function parseDate(str) {
    var datePattern = /^(\d{2})\/(\d{2})\/(\d{4}|\d{2})$/;
    var match = str.match(datePattern);
    if (match) {
        var day = parseInt(match[1]);
        var month = parseInt(match[2]) - 1;
        var year = parseInt(match[3]);
        if (year < 100) {
            year += 2000;
        }
        return new Date(year, month, day);
    }
    return null;
}
