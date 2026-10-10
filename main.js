'use strict';

var obsidian = require('obsidian');

/* ===== 常量 ===== */

var VIEW_TYPE_MOOD = 'mood-calendar';
var WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];
var WEEKDAY_MAP = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
var DEFAULT_SETTINGS = {
    // 界面语言（zh/en）
    language: 'zh',
    moodField: 'MyMood',
    folder: 'Daily',
    startOfWeek: 'monday',
    // 圆点大小（像素）
    dotSize: 5,
    // 心情显示字符数（数字或'all'）
    moodDisplayLength: 1,
    // 阅读模式下是否显示心情弹窗
    showPopupInReadingMode: false,
    // 点击不存在的日期时是否弹窗确认创建
    confirmCreateNote: true,
    // 创建日记时是否弹窗选择心情
    moodPopupOnCreate: true,
    // 心情选项列表
    moodOptions: [
        '🤩 狂喜',
        '😃 开心',
        '🙂 还行',
        '😐 平静',
        '😔 低落',
        '😫 糟糕',
        '😭 崩溃'
    ],
    // 颜色设置
    activeBorderColor: '#4a9eff',
    activeBgColor: 'rgba(74, 158, 255, 0.1)',
    todayBorderColor: '#e93147',
    todayBgColor: 'transparent',
    dotHollowColor: '#7c8493',
    dotFilledColor: '#000000'
};

/* ===== 国际化 ===== */

var currentLanguage = 'zh';

var MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var I18N = {
    zh: {
        viewTitle: '心情日历',
        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        prevMonthAria: '上个月',
        nextMonthAria: '下个月',
        todayBtn: '今天',
        selectMoodTitle: '选择今天的心情',
        skip: '跳过',
        confirmCreateMsg: '该日期没有日记，是否创建？',
        cancel: '取消',
        confirmBtn: '确定',
        createNoteFailed: '无法创建日记文件',
        settingsTitle: '心情日历设置',
        resetAll: '恢复所有默认设置',
        resetAllDesc: '将所有设置项恢复为默认值',
        resetDefault: '恢复默认',
        resetAllConfirm: '确定要恢复所有默认设置吗？',
        language: '语言',
        languageDesc: '插件界面语言',
        moodFieldName: 'Frontmatter 字段名',
        moodFieldDesc: '日记中存储心情的字段名',
        dailyFolder: '日记文件夹',
        dailyFolderDesc: '日记所在的文件夹路径（留空则自动读取日历插件设置）',
        startOfWeek: '每周起始日',
        monday: '周一',
        tuesday: '周二',
        wednesday: '周三',
        thursday: '周四',
        friday: '周五',
        saturday: '周六',
        sunday: '周日',
        confirmBeforeCreate: '创建日记前确认',
        confirmBeforeCreateDesc: '点击日历中不存在的日期时，弹窗确认是否创建日记',
        moodPopupOnCreate: '创建日记时弹窗心情',
        moodPopupOnCreateDesc: '创建新日记时弹窗选择心情，选择结果写入 frontmatter',
        moodPopupSection: '心情弹窗设置',
        showPopupReading: '阅读模式下显示心情弹窗',
        showPopupReadingDesc: '在阅读模式下悬停 MyMood 属性时是否显示心情选择弹窗（实时预览模式始终显示）',
        moodManageSection: '心情管理',
        resetMoods: '恢复默认心情',
        resetMoodsDesc: '将所有心情选项恢复为默认的 7 个心情',
        resetMoodsConfirm: '确定要恢复默认心情吗？',
        moodEmpty: '心情不能为空',
        moodDuplicate: '该心情已存在',
        moodPlaceholder: '🤩 狂喜',
        moveUp: '上移',
        moveDown: '下移',
        deleteBtn: '删除',
        addMood: '添加新心情',
        addMoodDesc: '点击添加一个新的心情到列表末尾',
        addBtn: '添加',
        dotSection: '圆点设置',
        dotSize: '圆点大小',
        dotSizeDesc: '空心/实心圆点的直径（像素，范围 2-10）',
        displaySection: '心情显示设置',
        displayLength: '心情显示字符数',
        displayLengthDesc: '显示心情文本的字符数（数字或 all，1 个 emoji 算 1 个字符，例如"🤩 狂喜"共 4 个字符）',
        colorSection: '颜色设置',
        activeBorder: '活动日期边框颜色',
        activeBorderDesc: '当前打开日记的边框颜色（支持 #hex 或 rgb()）',
        activeBg: '活动日期背景颜色',
        activeBgDesc: '当前打开日记的背景颜色（支持 transparent、#hex 或 rgba()）',
        todayBorder: '今天日期边框颜色',
        todayBorderDesc: '今天日期的边框颜色（支持 #hex 或 rgb()）',
        todayBg: '今天日期背景颜色',
        todayBgDesc: '今天日期的背景颜色（支持 transparent、#hex 或 rgba()）',
        dotHollow: '空心圆点边框颜色',
        dotHollowDesc: '有日记，但无心情，且有未完成任务时的空心圆点边框颜色（支持 #hex 或 rgb()）',
        dotFilled: '实心圆点颜色',
        dotFilledDesc: '有日记无心情无任务时的实心圆点颜色（支持 #hex 或 rgb()）'
    },
    en: {
        viewTitle: 'Mood Calendar',
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        prevMonthAria: 'Previous month',
        nextMonthAria: 'Next month',
        todayBtn: 'Today',
        selectMoodTitle: "Select today's mood",
        skip: 'Skip',
        confirmCreateMsg: 'No note for this date. Create one?',
        cancel: 'Cancel',
        confirmBtn: 'OK',
        createNoteFailed: 'Failed to create daily note',
        settingsTitle: 'Mood Calendar Settings',
        resetAll: 'Reset all settings',
        resetAllDesc: 'Restore all settings to their default values',
        resetDefault: 'Reset',
        resetAllConfirm: 'Reset all settings to default?',
        language: 'Language',
        languageDesc: 'Plugin interface language',
        moodFieldName: 'Frontmatter field',
        moodFieldDesc: 'Field name used to store the mood in daily notes',
        dailyFolder: 'Daily note folder',
        dailyFolderDesc: 'Folder path for daily notes (leave empty to use calendar plugin settings)',
        startOfWeek: 'Start of week',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
        confirmBeforeCreate: 'Confirm before creating',
        confirmBeforeCreateDesc: 'Ask for confirmation when clicking a date that has no note',
        moodPopupOnCreate: 'Mood popup on create',
        moodPopupOnCreateDesc: 'Show a mood picker when creating a new note; the choice is written to frontmatter',
        moodPopupSection: 'Mood popup',
        showPopupReading: 'Show mood popup in reading mode',
        showPopupReadingDesc: 'Show the mood picker when hovering the MyMood property in reading mode (always shown in live preview)',
        moodManageSection: 'Mood management',
        resetMoods: 'Reset default moods',
        resetMoodsDesc: 'Restore all mood options to the default 7 moods',
        resetMoodsConfirm: 'Reset mood options to default?',
        moodEmpty: 'Mood cannot be empty',
        moodDuplicate: 'This mood already exists',
        moodPlaceholder: '🤩 Ecstatic',
        moveUp: 'Move up',
        moveDown: 'Move down',
        deleteBtn: 'Delete',
        addMood: 'Add new mood',
        addMoodDesc: 'Add a new mood to the end of the list',
        addBtn: 'Add',
        dotSection: 'Dot settings',
        dotSize: 'Dot size',
        dotSizeDesc: 'Diameter of hollow/filled dots (pixels, range 2-10)',
        displaySection: 'Mood display',
        displayLength: 'Mood display length',
        displayLengthDesc: 'Number of characters to show (a number or "all"; one emoji counts as one character)',
        colorSection: 'Color settings',
        activeBorder: 'Active date border color',
        activeBorderDesc: 'Border color of the currently open note (supports #hex or rgb())',
        activeBg: 'Active date background color',
        activeBgDesc: 'Background color of the currently open note (supports transparent, #hex or rgba())',
        todayBorder: "Today's border color",
        todayBorderDesc: "Border color of today's date (supports #hex or rgb())",
        todayBg: "Today's background color",
        todayBgDesc: "Background color of today's date (supports transparent, #hex or rgba())",
        dotHollow: 'Hollow dot border color',
        dotHollowDesc: 'Hollow dot border color when a note has unfinished tasks but no mood (supports #hex or rgb())',
        dotFilled: 'Filled dot color',
        dotFilledDesc: 'Filled dot color when a note has no mood and no tasks (supports #hex or rgb())'
    }
};

function t(key) {
    var dict = I18N[currentLanguage] || I18N.zh;
    var val = dict[key];
    if (val === undefined) val = I18N.zh[key];
    return val !== undefined ? val : key;
}

/* ===== 读取 Obsidian 日记设置 ===== */

function getDailyNoteSettings() {
    try {
        var app = window.app;
        var periodicNotes = app.plugins.getPlugin('periodic-notes');
        if (periodicNotes && periodicNotes.settings && periodicNotes.settings.daily) {
            var pn = periodicNotes.settings.daily;
            return buildSettings(pn.format, pn.folder, pn.template);
        }
        var dailyNotes = app.internalPlugins.getPluginById('daily-notes');
        if (dailyNotes && dailyNotes.instance && dailyNotes.instance.options) {
            var opts = dailyNotes.instance.options;
            return buildSettings(opts.format, opts.folder, opts.template);
        }
    } catch (e) { /* ignore */ }
    return { fullFormat: 'YYYY-MM-DD', filenameFormat: 'YYYY-MM-DD', folder: '', template: '' };
}

function buildSettings(rawFormat, rawFolder, rawTemplate) {
    var fullFormat = (rawFormat || 'YYYY-MM-DD').trim();
    var parts = fullFormat.split('/');
    var filenameFormat = parts[parts.length - 1];
    return {
        fullFormat: fullFormat,
        filenameFormat: filenameFormat,
        folder: (rawFolder || '').trim(),
        template: (rawTemplate || '').trim()
    };
}

/* ===== 从文件名解析日期 ===== */

function parseDailyNoteDate(file, format) {
    if (!file || file.extension !== 'md') return null;
    var parsed = window.moment(file.basename, format, true);
    return parsed.isValid() ? parsed : null;
}

/* ===== 遍历文件夹读取一个月的心情数据 ===== */

async function readMonthMoods(app, year, month, settings) {
    var field = settings.moodField || 'MyMood';
    var folder = settings.folder || getDailyNoteSettings().folder || '';
    var format = getDailyNoteSettings().filenameFormat;
    var moods = {};

    var abstractFolder = folder ? app.vault.getAbstractFileByPath(folder) : null;
    if (!abstractFolder) return moods;

    obsidian.Vault.recurseChildren(abstractFolder, function (file) {
        var parsed = parseDailyNoteDate(file, format);
        if (!parsed) return;
        if (parsed.year() !== year || parsed.month() !== month) return;

        var day = parsed.date();
        var cache = app.metadataCache.getFileCache(file);
        var mood = null;

        if (cache && cache.frontmatter && cache.frontmatter[field]) {
            mood = String(cache.frontmatter[field]);
        }

        if (mood) moods[day] = mood;
    });

    return moods;
}

/* ===== 扫描一个月内每日的笔记状态 ===== */

async function scanMonthNotes(app, year, month, settings) {
    var folder = settings.folder || getDailyNoteSettings().folder || '';
    var filenameFormat = getDailyNoteSettings().filenameFormat;
    var field = settings.moodField || 'MyMood';
    var notes = {}; // day -> 'hasMood' | 'hasTask' | 'hasNote'

    var abstractFolder = folder ? app.vault.getAbstractFileByPath(folder) : null;
    if (!abstractFolder) return notes;

    // 收集当月所有日记文件
    var monthFiles = [];
    obsidian.Vault.recurseChildren(abstractFolder, function (file) {
        if (!file || file.extension !== 'md') return;
        var parsed = parseDailyNoteDate(file, filenameFormat);
        if (!parsed) return;
        if (parsed.year() !== year || parsed.month() !== month) return;
        monthFiles.push({ day: parsed.date(), file: file });
    });

    // 逐个检查心情和任务
    for (var i = 0; i < monthFiles.length; i++) {
        var entry = monthFiles[i];
        var day = entry.day;
        var file = entry.file;
        var cache = app.metadataCache.getFileCache(file);

        // 检查心情字段
        var hasMood = cache && cache.frontmatter && cache.frontmatter[field];

        // 读文件内容检查未完成任务 - [ ]
        var hasTask = false;
        try {
            var content = await app.vault.cachedRead(file);
            hasTask = /[-*] \[ \]/.test(content);
        } catch (e) { /* ignore */ }

        if (hasTask) {
            notes[day] = 'hasTask';
        } else if (hasMood) {
            notes[day] = 'hasMood';
        } else {
            notes[day] = 'hasNote';
        }
    }

    return notes;
}

/* ===== 提取首个 emoji ===== */

function extractEmoji(str, displayLength) {
    if (!str) return '';
    
    // 如果设置为 'all'，返回完整字符串
    if (displayLength === 'all') return str;
    
    // 默认显示 1 个字符
    var len = (typeof displayLength === 'number' && displayLength > 0) ? displayLength : 1;
    
    // 使用 Intl.Segmenter 正确分割 grapheme（处理 emoji 和组合字符）
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
            var seg = new Intl.Segmenter('zh', { granularity: 'grapheme' });
            var segments = seg.segment(str);
            var result = '';
            var count = 0;
            for (var segment of segments) {
                if (count >= len) break;
                result += segment.segment;
                count++;
            }
            return result;
        } catch (e) { /* fallback */ }
    }
    
    // 降级处理：简单按字符截取
    var code = str.charCodeAt(0);
    if (code >= 0xD800 && code <= 0xDBFF && str.length > 1) {
        return str.substring(0, 2);
    }
    return str.charAt(0);
}

/* ===== 确保日记存在，不存在则创建 ===== */

function joinPath() {
    var parts = Array.prototype.slice.call(arguments);
    return parts.filter(function (p) { return p; }).join('/').replace(/\/+/g, '/');
}

async function ensureFolderExists(path) {
    var dirs = path.replace(/\\/g, '/').split('/');
    dirs.pop();
    if (dirs.length) {
        var dir = dirs.join('/');
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}

async function getTemplateContent() {
    var app = window.app;
    var settings = getDailyNoteSettings();
    var templatePath = (settings.template || '').trim();
    if (!templatePath) return '';
    try {
        var normalizedPath = obsidian.normalizePath(templatePath);
        var templateFile = app.metadataCache.getFirstLinkpathDest(normalizedPath, '');
        if (templateFile) {
            return await app.vault.cachedRead(templateFile);
        }
    } catch (e) {
        console.warn('Mood Calendar: 读取日记模板失败', e);
    }
    return '';
}

function findDailyNote(app, dateStr, settings) {
    var dailySettings = getDailyNoteSettings();
    var filenameFormat = dailySettings.filenameFormat;
    var folder = settings.folder || dailySettings.folder || '';
    var abstractFolder = folder ? app.vault.getAbstractFileByPath(folder) : null;
    if (!abstractFolder) return null;
    var found = null;
    obsidian.Vault.recurseChildren(abstractFolder, function (file) {
        if (found) return;
        var parsed = parseDailyNoteDate(file, filenameFormat);
        if (parsed && parsed.format('YYYY-MM-DD') === dateStr) {
            found = file;
        }
    });
    return found;
}

async function ensureDailyNote(app, dateStr, settings, mood) {
    var dailySettings = getDailyNoteSettings();
    var filenameFormat = dailySettings.filenameFormat;
    var fullFormat = dailySettings.fullFormat;
    var folder = settings.folder || dailySettings.folder || '';

    // 用 moment 解析目标日期
    var targetDate = window.moment(dateStr, 'YYYY-MM-DD');

    // 在文件夹中查找已有文件（按日记文件名格式匹配）
    var abstractFolder = folder ? app.vault.getAbstractFileByPath(folder) : null;
    if (abstractFolder) {
        var found = null;
        obsidian.Vault.recurseChildren(abstractFolder, function (file) {
            if (found) return;
            var parsed = parseDailyNoteDate(file, filenameFormat);
            if (parsed && parsed.format('YYYY-MM-DD') === dateStr) {
                found = file;
            }
        });
        if (found) return found;
    }

    // 构建路径：用 fullFormat 生成包含子目录的完整相对路径
    var relativePath = targetDate.format(fullFormat);
    var filePath = obsidian.normalizePath(joinPath(folder, relativePath + '.md'));

    await ensureFolderExists(filePath);

    var templateContent = await getTemplateContent();
    try {
        var file = await app.vault.create(filePath, templateContent);
        if (mood && file) {
            var field = settings.moodField || 'MyMood';
            var content = await app.vault.read(file);
            var moodLine = field + ': "' + mood + '"';
            var nl = content.startsWith('---\r\n') ? '\r\n' : '\n';
            if (content.startsWith('---' + nl)) {
                // 在闭合 --- 前插入
                var closeIdx = content.indexOf(nl + '---', 3 + nl.length);
                if (closeIdx !== -1) {
                    var newContent = content.slice(0, closeIdx) + nl + moodLine + content.slice(closeIdx);
                    await app.vault.modify(file, newContent);
                } else {
                    // 无闭合 ---，在开头后插入
                    var newContent = '---' + nl + moodLine + nl + content.slice(3 + nl.length);
                    await app.vault.modify(file, newContent);
                }
            } else {
                // 无 frontmatter，新建一个
                await app.vault.modify(file, '---\n' + moodLine + '\n---\n\n' + content);
            }
        }
        return file;
    } catch (err) {
        console.error('Mood Calendar: 创建日记失败', err);
        new obsidian.Notice(t('createNoteFailed'));
        return null;
    }
}

/* ===== 心情选择弹窗 ===== */

class MoodSelectionModal extends obsidian.Modal {
    constructor(app, title, moodOptions, onSelect) {
        super(app);
        this.title = title;
        this.moodOptions = moodOptions;
        this.onSelect = onSelect;
    }
    onOpen() {
        var contentEl = this.contentEl;
        contentEl.createEl('h3', { text: this.title });
        var btnContainer = contentEl.createDiv({ cls: 'mood-selection-buttons' });
        var self = this;
        this.moodOptions.forEach(function (option) {
            var btn = btnContainer.createEl('button', { text: option, cls: 'mood-selection-btn' });
            btn.addEventListener('click', function () {
                self.close();
                self.onSelect(option);
            });
        });
        var skipContainer = contentEl.createDiv({ cls: 'modal-button-container' });
        skipContainer.createEl('button', { text: t('skip'), cls: 'mod-muted' })
            .addEventListener('click', function () {
                self.close();
                self.onSelect(null);
            });
    }
    onClose() {
        this.contentEl.empty();
    }
}

/* ===== 日期点击处理 ===== */

function handleDateClick(app, dateStr, settings, plugin) {
    var existing = findDailyNote(app, dateStr, settings);
    if (existing) {
        app.workspace.getLeaf(false).openFile(existing);
        return;
    }
    var createNote = async function (mood) {
        var file = await ensureDailyNote(app, dateStr, settings, mood);
        if (file) app.workspace.getLeaf(false).openFile(file);
    };
    if (settings.moodPopupOnCreate) {
        new MoodSelectionModal(app, t('selectMoodTitle'), settings.moodOptions, function (mood) {
            createNote(mood);
        }).open();
    } else if (settings.confirmCreateNote) {
        new ConfirmModal(app, t('confirmCreateMsg'), function () {
            createNote(null);
        }).open();
    } else {
        createNote(null);
    }
}

/* ===== 渲染日历到容器 ===== */

function renderCalendar(container, year, month, moods, settings, callbacks, prevMoods, nextMoods, notes, prevNotes, nextNotes, shouldAutoScroll, scrollTarget, userNavigated, plugin) {
    prevMoods = prevMoods || {};
    nextMoods = nextMoods || {};
    notes = notes || {};
    prevNotes = prevNotes || {};
    nextNotes = nextNotes || {};
    shouldAutoScroll = shouldAutoScroll !== false;
    userNavigated = userNavigated || false; // 默认为 true
    
    // 保存滚动位置
    var scrollContainer = container.querySelector('.mood-calendar-scroll-container');
    var savedScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    
    container.empty();

    var startDay = WEEKDAY_MAP[settings.startOfWeek] !== undefined ? WEEKDAY_MAP[settings.startOfWeek] : 1;
    var firstDay = new Date(year, month, 1).getDay();
    var offset = (firstDay - startDay + 7) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date();
    var isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // 标题栏
    var header = container.createDiv({ cls: 'mood-calendar-header' });

    var titleEl = header.createDiv({ cls: 'mood-calendar-title' });
    if (currentLanguage === 'en') {
        titleEl.createSpan({ cls: 'mood-title-month', text: MONTH_NAMES_EN[month] });
        titleEl.createSpan({ cls: 'mood-title-year', text: String(year) });
    } else {
        titleEl.createSpan({ cls: 'mood-title-year', text: year + '年' });
        titleEl.createSpan({ cls: 'mood-title-month', text: (month + 1) + '月' });
    }

    var nav = header.createDiv({ cls: 'mood-calendar-nav' });
    var prevBtn = nav.createEl('button', { text: '<', attr: { 'aria-label': t('prevMonthAria') } });
    prevBtn.addEventListener('click', function () { callbacks.prev(); });
    var todayBtn = nav.createEl('button', { text: t('todayBtn'), cls: 'mood-today-btn' });
    todayBtn.addEventListener('click', function () { callbacks.today(); });
    var nextBtn = nav.createEl('button', { text: '>', attr: { 'aria-label': t('nextMonthAria') } });
    nextBtn.addEventListener('click', function () { callbacks.next(); });

    // 可滚动容器（包含星期行和日期网格）
    var scrollContainer = container.createDiv({ cls: 'mood-calendar-scroll-container' });

    // 星期行
    var weekdayRow = scrollContainer.createDiv({ cls: 'mood-calendar-weekdays' });
    var weekdayNames = t('weekdays');
    for (var w = 0; w < 7; w++) {
        weekdayRow.createSpan({ text: weekdayNames[(startDay + w) % 7] });
    }

    // 当前打开的日记日期（按日记格式解析）
    var activeDateStr = '';
    var activeFile = window.app.workspace.getActiveFile();
    if (activeFile && activeFile.extension === 'md') {
        var dailySettings = getDailyNoteSettings();
        var parsed = window.moment(activeFile.basename, dailySettings.filenameFormat, true);
        if (parsed.isValid()) {
            activeDateStr = parsed.format('YYYY-MM-DD');
        }
    }

    // 日期网格
    var grid = scrollContainer.createDiv({ cls: 'mood-calendar-grid' });

    // 上月尾部填充
    var prevMonthDays = new Date(year, month, 0).getDate(); // 上月总天数
    var prevYear = new Date(year, month, 0).getFullYear();
    var prevMonth = new Date(year, month, 0).getMonth();
    for (var i = offset - 1; i >= 0; i--) {
        var prevDay = prevMonthDays - i;
        var prevDayEl = grid.createDiv({ cls: 'mood-calendar-day other-month' });
        var prevDs = prevYear + '-' + String(prevMonth + 1).padStart(2, '0') + '-' + String(prevDay).padStart(2, '0');
        prevDayEl.createSpan({ cls: 'mood-day-number', text: String(prevDay) });
        if (prevDs === activeDateStr) prevDayEl.addClass('active');
        prevDayEl.createSpan({ cls: 'mood-emoji', text: prevMoods[prevDay] ? extractEmoji(prevMoods[prevDay], settings.moodDisplayLength) : '' });
        var prevDotWrap = prevDayEl.createDiv({ cls: 'mood-dot-container' });
        if (prevNotes[prevDay] === 'hasTask') {
            prevDotWrap.createDiv({ cls: 'mood-dot hollow task' });
        } else if (prevNotes[prevDay] === 'hasNote') {
            prevDotWrap.createDiv({ cls: 'mood-dot filled' });
        }
        (function (py, pm, pd) {
            prevDayEl.addEventListener('click', async function () {
                var ds = py + '-' + String(pm + 1).padStart(2, '0') + '-' + String(pd).padStart(2, '0');
                handleDateClick(window.app, ds, settings, plugin);
            });
        })(prevYear, prevMonth, prevDay);
    }

    for (var d = 1; d <= daysInMonth; d++) {
        var dayEl = grid.createDiv({ cls: 'mood-calendar-day' });
        var ds = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        if (isCurrentMonth && d === today.getDate()) dayEl.addClass('today');
        if (ds === activeDateStr) dayEl.addClass('active');
        dayEl.createSpan({ cls: 'mood-day-number', text: String(d) });
        dayEl.createSpan({ cls: 'mood-emoji', text: moods[d] ? extractEmoji(moods[d], settings.moodDisplayLength) : '' });
        // dot: 始终创建容器保证对齐，有未完成任务→空心点，有日记无心情无任务→实心点
        var dotWrap = dayEl.createDiv({ cls: 'mood-dot-container' });
        if (notes[d] === 'hasTask') {
            dotWrap.createDiv({ cls: 'mood-dot hollow task' });
        } else if (notes[d] === 'hasNote') {
            dotWrap.createDiv({ cls: 'mood-dot filled' });
        }
        (function (day) {
            dayEl.addEventListener('click', async function () {
                var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                handleDateClick(window.app, dateStr, settings, plugin);
            });
        })(d);
    }

    // 下月头部填充（凑满整行）
    var totalCells = offset + daysInMonth;
    var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    var nextDate = new Date(year, month + 1, 1);
    var nextYear = nextDate.getFullYear();
    var nextMonth = nextDate.getMonth();
    for (var n = 1; n <= remaining; n++) {
        var nextDayEl = grid.createDiv({ cls: 'mood-calendar-day other-month' });
        var nextDs = nextYear + '-' + String(nextMonth + 1).padStart(2, '0') + '-' + String(n).padStart(2, '0');
        nextDayEl.createSpan({ cls: 'mood-day-number', text: String(n) });
        if (nextDs === activeDateStr) nextDayEl.addClass('active');
        nextDayEl.createSpan({ cls: 'mood-emoji', text: nextMoods[n] ? extractEmoji(nextMoods[n], settings.moodDisplayLength) : '' });
        var nextDotWrap = nextDayEl.createDiv({ cls: 'mood-dot-container' });
        if (nextNotes[n] === 'hasTask') {
            nextDotWrap.createDiv({ cls: 'mood-dot hollow task' });
        } else if (nextNotes[n] === 'hasNote') {
            nextDotWrap.createDiv({ cls: 'mood-dot filled' });
        }
        (function (ny, nm, nd) {
            nextDayEl.addEventListener('click', async function () {
                var ds = ny + '-' + String(nm + 1).padStart(2, '0') + '-' + String(nd).padStart(2, '0');
                handleDateClick(window.app, ds, settings, plugin);
            });
        })(nextYear, nextMonth, n);
    }

    // 处理滚动位置
    var newScrollContainer = container.querySelector('.mood-calendar-scroll-container');
    if (newScrollContainer) {
        // 如果用户手动导航过，且没有明确的滚动目标，恢复保存的滚动位置
        if (userNavigated && !scrollTarget) {
            newScrollContainer.scrollLeft = savedScrollLeft;
        } else if (shouldAutoScroll) {
            // 根据 scrollTarget 参数决定滚动到哪个元素
            var targetEl = null;
            if (scrollTarget === 'today') {
                targetEl = newScrollContainer.querySelector('.mood-calendar-day.today');
            } else {
                // 默认滚动到活动日期
                targetEl = newScrollContainer.querySelector('.mood-calendar-day.active');
            }
            if (targetEl) {
                // 使用 requestAnimationFrame 确保布局完成
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        var containerRect = newScrollContainer.getBoundingClientRect();
                        var targetRect = targetEl.getBoundingClientRect();
                        
                        // 计算目标相对于容器的位置
                        var relativeLeft = targetRect.left - containerRect.left;
                        var scrollLeft = newScrollContainer.scrollLeft + relativeLeft - (containerRect.width / 2) + (targetRect.width / 2);
                        
                        // 限制滚动范围
                        var maxScroll = Math.max(0, newScrollContainer.scrollWidth - newScrollContainer.clientWidth);
                        scrollLeft = Math.max(0, Math.min(scrollLeft, maxScroll));
                        
                        newScrollContainer.scrollLeft = scrollLeft;
                    });
                });
            }
        } else {
            // 恢复之前的滚动位置
            newScrollContainer.scrollLeft = savedScrollLeft;
        }
    }
}

/* ===== 侧边栏视图 ===== */

class MoodCalendarView extends obsidian.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this._monthOffset = 0;
        this._initialized = false;
        this._userNavigated = false;
        this._rendering = false;
        this._pendingRender = null;
    }
    getViewType() { return VIEW_TYPE_MOOD; }
    getDisplayText() { return t('viewTitle'); }
    getIcon() { return 'smile'; }

    async onOpen() { this._render(); }
    async onClose() {}

    // 外部调用：跳转到活动文件所在月份
    navigateToActiveFile() {
        var activeFile = window.app.workspace.getActiveFile();
        if (!activeFile || activeFile.extension !== 'md') return;
        var dailySettings = getDailyNoteSettings();
        var parsed = window.moment(activeFile.basename, dailySettings.filenameFormat, true);
        if (!parsed.isValid()) return;
        var now = new Date();
        var offset = (parsed.year() - now.getFullYear()) * 12 + (parsed.month() - now.getMonth());
        
        // 如果用户手动导航过，且文件在当前显示的月份内，则不改变视图
        if (this._userNavigated && offset === this._monthOffset) return;
        
        // 如果文件在其他月份，更新视图并重置 _userNavigated
        if (offset !== this._monthOffset) {
            this._monthOffset = offset;
            this._userNavigated = false;
        }
    }

    async _render(shouldAutoScroll, scrollTarget) {
        // 防止并发渲染
        if (this._rendering) {
            // 如果当前有待执行的渲染，且新请求没有明确的 scrollTarget，则保留原来的 scrollTarget
            if (this._pendingRender && this._pendingRender.scrollTarget && !scrollTarget) {
                this._pendingRender.shouldAutoScroll = shouldAutoScroll;
                // 保留原来的 scrollTarget
            } else {
                this._pendingRender = { shouldAutoScroll, scrollTarget };
            }
            return;
        }
        this._rendering = true;
        
        try {
            var now = new Date();

            // 首次打开：根据活动文件设置初始月份
            if (!this._initialized) {
                this._initialized = true;
                shouldAutoScroll = true; // 首次渲染时自动滚动
                scrollTarget = 'active'; // 首次渲染滚动到活动日期
                var activeFile = window.app.workspace.getActiveFile();
                if (activeFile && activeFile.extension === 'md') {
                    var dailySettings = getDailyNoteSettings();
                    var parsed = window.moment(activeFile.basename, dailySettings.filenameFormat, true);
                    if (parsed.isValid()) {
                        this._monthOffset = (parsed.year() - now.getFullYear()) * 12 + (parsed.month() - now.getMonth());
                    }
                }
            }
            
            // 如果需要自动滚动但没有指定目标，且用户没有手动导航过，才使用智能检测
            if (shouldAutoScroll && !scrollTarget && !this._userNavigated) {
                var activeFile = window.app.workspace.getActiveFile();
                var todayStr = window.moment().format('YYYY-MM-DD');
                if (activeFile && activeFile.extension === 'md') {
                    var dailySettings = getDailyNoteSettings();
                    var parsed = window.moment(activeFile.basename, dailySettings.filenameFormat, true);
                    if (parsed.isValid() && parsed.format('YYYY-MM-DD') === todayStr) {
                        scrollTarget = 'today';
                    } else {
                        scrollTarget = 'active';
                    }
                } else {
                    scrollTarget = 'today';
                }
            }

            var target = new Date(now.getFullYear(), now.getMonth() + this._monthOffset, 1);
            var year = target.getFullYear();
            var month = target.getMonth();
            var self = this;

            // 并行读取当月及前后月心情数据 + 笔记状态
            var prevDate = new Date(year, month - 1, 1);
            var nextDate = new Date(year, month + 1, 1);
            var results = await Promise.all([
                readMonthMoods(window.app, prevDate.getFullYear(), prevDate.getMonth(), this.plugin.settings),
                readMonthMoods(window.app, year, month, this.plugin.settings),
                readMonthMoods(window.app, nextDate.getFullYear(), nextDate.getMonth(), this.plugin.settings),
                scanMonthNotes(window.app, prevDate.getFullYear(), prevDate.getMonth(), this.plugin.settings),
                scanMonthNotes(window.app, year, month, this.plugin.settings),
                scanMonthNotes(window.app, nextDate.getFullYear(), nextDate.getMonth(), this.plugin.settings)
            ]);

            renderCalendar(this.contentEl, year, month, results[1], this.plugin.settings, {
                prev: function () { self._userNavigated = true; self._monthOffset--; self._render(true, 'active'); },
                next: function () { self._userNavigated = true; self._monthOffset++; self._render(true, 'active'); },
                today: function () { self._userNavigated = true; self._monthOffset = 0; self._render(true, 'today'); }
            }, results[0], results[2], results[4], results[3], results[5], shouldAutoScroll, scrollTarget, this._userNavigated, this.plugin);
            this.contentEl.addClass('mood-calendar-view');
        } finally {
            this._rendering = false;
            
            // 处理挂起的渲染请求
            if (this._pendingRender) {
                var pending = this._pendingRender;
                this._pendingRender = null;
                this._render(pending.shouldAutoScroll, pending.scrollTarget);
            }
        }
    }
}

/* ===== 确认对话框 ===== */

class ConfirmModal extends obsidian.Modal {
    constructor(app, message, onConfirm) {
        super(app);
        this.message = message;
        this.onConfirm = onConfirm;
    }
    onOpen() {
        var contentEl = this.contentEl;
        contentEl.createEl('p', { text: this.message });
        var btnContainer = contentEl.createDiv({ cls: 'modal-button-container' });
        btnContainer.createEl('button', { text: t('cancel'), cls: 'mod-muted' })
            .addEventListener('click', () => this.close());
        btnContainer.createEl('button', { text: t('confirmBtn'), cls: 'mod-warning' })
            .addEventListener('click', () => {
                this.close();
                this.onConfirm();
            });
    }
    onClose() {
        this.contentEl.empty();
    }
}

/* ===== 设置面板 ===== */

class MoodCalendarSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        var scrollTop = this.containerEl.scrollTop;
        
        var self = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.addClass('mood-calendar-settings');
        containerEl.createEl('h2', { text: t('settingsTitle') });
        
        // 全局恢复默认按钮
        new obsidian.Setting(containerEl)
            .setName(t('resetAll'))
            .setDesc(t('resetAllDesc'))
            .addButton(function (button) {
                button.setButtonText(t('resetDefault'))
                    .setWarning()
                    .onClick(function () {
                        new ConfirmModal(self.app, t('resetAllConfirm'), function () {
                            self.plugin.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
                            self.plugin.saveSettings();
                            self.display();
                        }).open();
                    });
            });

        new obsidian.Setting(containerEl)
            .setName(t('language'))
            .setDesc(t('languageDesc'))
            .addDropdown(function (dropdown) {
                dropdown
                    .addOption('zh', '中文')
                    .addOption('en', 'English')
                    .setValue(self.plugin.settings.language)
                    .onChange(function (v) {
                        self.plugin.settings.language = v;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });

        var fieldSetting = new obsidian.Setting(containerEl);
        fieldSetting.settingEl.addClass('mood-text-setting');
        fieldSetting.setName(t('moodFieldName'))
            .setDesc(t('moodFieldDesc'))
            .addText(function (text) {
                text.setPlaceholder('MyMood')
                    .setValue(self.plugin.settings.moodField)
                    .onChange(function (v) {
                        self.plugin.settings.moodField = v;
                        self.plugin.saveSettings();
                    });
            });

        var folderSetting = new obsidian.Setting(containerEl);
        folderSetting.settingEl.addClass('mood-text-setting');
        folderSetting.setName(t('dailyFolder'))
            .setDesc(t('dailyFolderDesc'))
            .addText(function (text) {
                text.setPlaceholder('Daily')
                    .setValue(self.plugin.settings.folder)
                    .onChange(function (v) {
                        self.plugin.settings.folder = v;
                        self.plugin.saveSettings();
                    });
            });

        var startOfWeekSetting = new obsidian.Setting(containerEl);
        startOfWeekSetting.settingEl.addClass('mood-dropdown-setting');
        startOfWeekSetting.setName(t('startOfWeek'))
            .addDropdown(function (dropdown) {
                dropdown
                    .addOption('monday', t('monday'))
                    .addOption('tuesday', t('tuesday'))
                    .addOption('wednesday', t('wednesday'))
                    .addOption('thursday', t('thursday'))
                    .addOption('friday', t('friday'))
                    .addOption('saturday', t('saturday'))
                    .addOption('sunday', t('sunday'))
                    .setValue(self.plugin.settings.startOfWeek)
                    .onChange(function (v) {
                        self.plugin.settings.startOfWeek = v;
                        self.plugin.saveSettings();
                    });
            });
        
        new obsidian.Setting(containerEl)
            .setName(t('confirmBeforeCreate'))
            .setDesc(t('confirmBeforeCreateDesc'))
            .addToggle(function (toggle) {
                toggle.setValue(self.plugin.settings.confirmCreateNote)
                    .onChange(function (v) {
                        self.plugin.settings.confirmCreateNote = v;
                        self.plugin.saveSettings();
                    });
            });

        new obsidian.Setting(containerEl)
            .setName(t('moodPopupOnCreate'))
            .setDesc(t('moodPopupOnCreateDesc'))
            .addToggle(function (toggle) {
                toggle.setValue(self.plugin.settings.moodPopupOnCreate)
                    .onChange(function (v) {
                        self.plugin.settings.moodPopupOnCreate = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.moodPopupOnCreate = DEFAULT_SETTINGS.moodPopupOnCreate;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });

        containerEl.createEl('h3', { text: t('moodPopupSection') });
        
        new obsidian.Setting(containerEl)
            .setName(t('showPopupReading'))
            .setDesc(t('showPopupReadingDesc'))
            .addToggle(function (toggle) {
                toggle.setValue(self.plugin.settings.showPopupInReadingMode)
                    .onChange(function (v) {
                        self.plugin.settings.showPopupInReadingMode = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.showPopupInReadingMode = DEFAULT_SETTINGS.showPopupInReadingMode;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        containerEl.createEl('h3', { text: t('moodManageSection') });
        
        // 恢复默认心情按钮
        new obsidian.Setting(containerEl)
            .setName(t('resetMoods'))
            .setDesc(t('resetMoodsDesc'))
            .addButton(function (button) {
                button.setButtonText(t('resetDefault'))
                    .setWarning()
                    .onClick(function () {
                        new ConfirmModal(self.app, t('resetMoodsConfirm'), function () {
                            self.plugin.settings.moodOptions = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.moodOptions));
                            self.plugin.saveSettings();
                            self.display();
                        }).open();
                    });
            });
        
        // 显示所有心情选项
        var self = this;
        var options = self.plugin.settings.moodOptions;
        
        // 检查 DOM 中输入框的实际值（空或重复）
        var checkInvalid = function () {
            var inputs = containerEl.querySelectorAll('.mood-option-setting input[type="text"]');
            var values = [];
            for (var i = 0; i < inputs.length; i++) {
                var v = inputs[i].value.trim();
                if (!v) return true;
                if (values.indexOf(v) !== -1) return true;
                values.push(v);
            }
            return false;
        };
        
        options.forEach(function (mood, index) {
            var setting = new obsidian.Setting(containerEl);
            setting.settingEl.addClass('mood-option-setting');
            
            setting.addText(function (text) {
                text.setPlaceholder(t('moodPlaceholder'))
                    .setValue(mood)
                    .onChange(function (v) {
                        var trimmed = v.trim();
                        var errEl = text.inputEl.parentElement.querySelector('.mood-option-error');
                        
                        if (!trimmed) {
                            text.inputEl.style.borderColor = 'red';
                            if (errEl) errEl.textContent = t('moodEmpty');
                        } else {
                            var isDuplicate = self.plugin.settings.moodOptions.some(function (m, i) {
                                return i !== index && m === trimmed;
                            });
                            
                            if (isDuplicate) {
                                text.inputEl.style.borderColor = 'red';
                                if (errEl) errEl.textContent = t('moodDuplicate');
                            } else {
                                text.inputEl.style.borderColor = '';
                                if (errEl) errEl.textContent = '';
                                self.plugin.settings.moodOptions[index] = trimmed;
                                self.plugin.saveSettings();
                            }
                        }
                        // 统一更新添加按钮状态
                        if (self._addButtonComp) self._addButtonComp.setDisabled(checkInvalid());
                    });
                
                // 在输入框下方创建错误提示
                var errEl = document.createElement('div');
                errEl.className = 'mood-option-error';
                errEl.style.cssText = 'color: var(--text-error); font-size: 12px; padding: 2px 0;';
                text.inputEl.parentElement.appendChild(errEl);
                
                // 初始状态检查
                if (!mood.trim()) {
                    text.inputEl.style.borderColor = 'red';
                    errEl.textContent = t('moodEmpty');
                }
            });
            
            // 上移按钮（第一个元素禁用）
            setting.addExtraButton(function (button) {
                button.setIcon('arrow-up')
                    .setTooltip(t('moveUp'));
                if (index === 0) {
                    button.setDisabled(true);
                } else {
                    button.onClick(function () {
                        var temp = self.plugin.settings.moodOptions[index];
                        self.plugin.settings.moodOptions[index] = self.plugin.settings.moodOptions[index - 1];
                        self.plugin.settings.moodOptions[index - 1] = temp;
                        self.plugin.saveSettings();
                        self.display();
                    });
                }
            });
            
            // 下移按钮（最后一个元素禁用）
            setting.addExtraButton(function (button) {
                button.setIcon('arrow-down')
                    .setTooltip(t('moveDown'));
                if (index === self.plugin.settings.moodOptions.length - 1) {
                    button.setDisabled(true);
                } else {
                    button.onClick(function () {
                        var temp = self.plugin.settings.moodOptions[index];
                        self.plugin.settings.moodOptions[index] = self.plugin.settings.moodOptions[index + 1];
                        self.plugin.settings.moodOptions[index + 1] = temp;
                        self.plugin.saveSettings();
                        self.display();
                    });
                }
            });
            
            // 删除按钮
            setting.addExtraButton(function (button) {
                button.setIcon('trash')
                    .setTooltip(t('deleteBtn'))
                    .onClick(function () {
                        self.plugin.settings.moodOptions.splice(index, 1);
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        });
        
        // 添加新心情按钮（放在列表下方）
        new obsidian.Setting(containerEl)
            .setName(t('addMood'))
            .setDesc(t('addMoodDesc'))
            .addButton(function (button) {
                self._addButtonComp = button;
                button.setButtonText(t('addBtn'))
                    .setCta()
                    .setDisabled(checkInvalid())
                    .onClick(function () {
                        if (checkInvalid()) return;
                        self.plugin.settings.moodOptions.push('');
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        containerEl.createEl('h3', { text: t('dotSection') });
        
        new obsidian.Setting(containerEl)
            .setName(t('dotSize'))
            .setDesc(t('dotSizeDesc'))
            .addSlider(function (slider) {
                slider.setLimits(2, 10, 1)
                    .setValue(self.plugin.settings.dotSize)
                    .setDynamicTooltip()
                    .onChange(function (v) {
                        self.plugin.settings.dotSize = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.dotSize = DEFAULT_SETTINGS.dotSize;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        containerEl.createEl('h3', { text: t('displaySection') });
        
        var displayLengthSetting = new obsidian.Setting(containerEl);
        displayLengthSetting.settingEl.addClass('mood-display-length-setting');
        displayLengthSetting.setName(t('displayLength'))
            .setDesc(t('displayLengthDesc'))
            .addText(function (text) {
                text.setPlaceholder('1')
                    .setValue(String(self.plugin.settings.moodDisplayLength))
                    .onChange(function (v) {
                        if (v === 'all') {
                            self.plugin.settings.moodDisplayLength = 'all';
                        } else {
                            var num = parseInt(v);
                            if (!isNaN(num) && num > 0) {
                                self.plugin.settings.moodDisplayLength = num;
                            }
                        }
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.moodDisplayLength = DEFAULT_SETTINGS.moodDisplayLength;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        containerEl.createEl('h3', { text: t('colorSection') });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('activeBorder'))
            .setDesc(t('activeBorderDesc'))
            .addText(function (text) {
                text.setPlaceholder('#4a9eff')
                    .setValue(self.plugin.settings.activeBorderColor)
                    .onChange(function (v) {
                        self.plugin.settings.activeBorderColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.activeBorderColor = DEFAULT_SETTINGS.activeBorderColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('activeBg'))
            .setDesc(t('activeBgDesc'))
            .addText(function (text) {
                text.setPlaceholder('rgba(74, 158, 255, 0.1)')
                    .setValue(self.plugin.settings.activeBgColor)
                    .onChange(function (v) {
                        self.plugin.settings.activeBgColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.activeBgColor = DEFAULT_SETTINGS.activeBgColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('todayBorder'))
            .setDesc(t('todayBorderDesc'))
            .addText(function (text) {
                text.setPlaceholder('#e93147')
                    .setValue(self.plugin.settings.todayBorderColor)
                    .onChange(function (v) {
                        self.plugin.settings.todayBorderColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.todayBorderColor = DEFAULT_SETTINGS.todayBorderColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('todayBg'))
            .setDesc(t('todayBgDesc'))
            .addText(function (text) {
                text.setPlaceholder('transparent')
                    .setValue(self.plugin.settings.todayBgColor)
                    .onChange(function (v) {
                        self.plugin.settings.todayBgColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.todayBgColor = DEFAULT_SETTINGS.todayBgColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('dotHollow'))
            .setDesc(t('dotHollowDesc'))
            .addText(function (text) {
                text.setPlaceholder('#7c8493')
                    .setValue(self.plugin.settings.dotHollowColor)
                    .onChange(function (v) {
                        self.plugin.settings.dotHollowColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.dotHollowColor = DEFAULT_SETTINGS.dotHollowColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        var colorSetting = new obsidian.Setting(containerEl);
        colorSetting.settingEl.addClass('mood-color-setting');
        colorSetting.setName(t('dotFilled'))
            .setDesc(t('dotFilledDesc'))
            .addText(function (text) {
                text.setPlaceholder('#000000')
                    .setValue(self.plugin.settings.dotFilledColor)
                    .onChange(function (v) {
                        self.plugin.settings.dotFilledColor = v;
                        self.plugin.saveSettings();
                    });
            })
            .addExtraButton(function (button) {
                button.setIcon('reset')
                    .setTooltip(t('resetDefault'))
                    .onClick(function () {
                        self.plugin.settings.dotFilledColor = DEFAULT_SETTINGS.dotFilledColor;
                        self.plugin.saveSettings();
                        self.display();
                    });
            });
        
        // 恢复滚动位置
        var ce = this.containerEl;
        if (scrollTop > 0) {
            requestAnimationFrame(function () { ce.scrollTop = scrollTop; });
            setTimeout(function () { ce.scrollTop = scrollTop; }, 0);
            setTimeout(function () { ce.scrollTop = scrollTop; }, 50);
        }
    }
}

/* ===== 主插件 ===== */

class MoodCalendarPlugin extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();

        this._refreshTimer = null;
        this._isUnloaded = false;
        this.registerView(VIEW_TYPE_MOOD, (leaf) => new MoodCalendarView(leaf, this));

        this.addRibbonIcon('smile', t('viewTitle'), () => this.activateView());
        
        // 应用颜色设置
        this.applyColorSettings();
        
        // 注册 Live Preview 模式的心情选择器
        this.createMoodSelectorExtension();

        // 代码块: ```mood-calendar
        this.registerMarkdownCodeBlockProcessor('mood-calendar', (source, el, ctx) => {
            el.addClass('mood-calendar-block');
            var self = this;
            var state = { monthOffset: 0 };

            var render = async function () {
                var now = new Date();
                var target = new Date(now.getFullYear(), now.getMonth() + state.monthOffset, 1);
                var year = target.getFullYear();
                var month = target.getMonth();

                var prevDate = new Date(year, month - 1, 1);
                var nextDate = new Date(year, month + 1, 1);
                var results = await Promise.all([
                    readMonthMoods(self.app, prevDate.getFullYear(), prevDate.getMonth(), self.settings),
                    readMonthMoods(self.app, year, month, self.settings),
                    readMonthMoods(self.app, nextDate.getFullYear(), nextDate.getMonth(), self.settings),
                    scanMonthNotes(self.app, prevDate.getFullYear(), prevDate.getMonth(), self.settings),
                    scanMonthNotes(self.app, year, month, self.settings),
                    scanMonthNotes(self.app, nextDate.getFullYear(), nextDate.getMonth(), self.settings)
                ]);

                renderCalendar(el, year, month, results[1], self.settings, {
                    prev: function () { state.monthOffset--; render(); },
                    next: function () { state.monthOffset++; render(); },
                    today: function () { state.monthOffset = 0; render(); }
                }, results[0], results[2], results[4], results[3], results[5], false, undefined, false, self);
            };

            render();
        });

        this.addSettingTab(new MoodCalendarSettingTab(this.app, this));

        // 启动时自动在右侧边栏显示日历
        // 修复：延迟插件（比如：plugin-manager）延迟加载时，Obsidian 恢复 workspace.json 中已保存的视图
        // 与本插件的自动创建存在时序竞争，导致右侧边栏重复创建图标。
        // 因此改为多次延迟检查：先去重，再复用待恢复标签页，最后才新建。
        var self = this;
        this.app.workspace.onLayoutReady(function () {
            self._syncSidebarView();
            var delays = [500, 1500, 3000];
            for (var i = 0; i < delays.length; i++) {
                (function (delay) {
                    var timer = window.setTimeout(function () { self._syncSidebarView(); }, delay);
                    self.register(function () { window.clearTimeout(timer); });
                })(delays[i]);
            }
        });

        // 监听 frontmatter 变化 → 只更新数据，不滚动
        this.registerEvent(
            this.app.metadataCache.on('changed', (file) => {
                if (file.extension === 'md' && file.path.startsWith(this.settings.folder + '/')) {
                    this._scheduleRefresh(500, false);
                }
            })
        );

        // 监听新文件创建 → 延迟刷新，不滚动
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file.extension === 'md' && file.path.startsWith(this.settings.folder + '/')) {
                    this._scheduleRefresh(1000, false);
                }
            })
        );

        // 监听活动文件切换 → 自动滚动到活动日期
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', () => {
                // 重置所有视图的 _userNavigated，允许智能检测运行
                var leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOOD);
                leaves.forEach(function (leaf) {
                    if (leaf.view) {
                        leaf.view._userNavigated = false;
                    }
                });
                
                this._scheduleRefresh(100, true);
                if (leaves.length > 0 && leaves[0].view.navigateToActiveFile) {
                    leaves[0].view.navigateToActiveFile();
                }
            })
        );
    }

    onunload() {
        this._isUnloaded = true;
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_MOOD);
    }

    async activateView() {
        var existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOOD);
        if (existing.length > 1) {
            this._dedupeLeaves(existing);
            existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOOD);
        }
        if (existing.length > 0) {
            this.app.workspace.revealLeaf(existing[0]);
            if (existing[0].view && existing[0].view._render) existing[0].view._render();
            return;
        }
        // 优先复用 workspace 中待恢复的标签页（延迟加载场景）
        var pending = this._findPendingLeaf();
        var leaf = pending || this.app.workspace.getRightLeaf(false);
        await leaf.setViewState({ type: VIEW_TYPE_MOOD, active: true });
    }

    /**
     * 同步右侧边栏视图：去重 → 复用待恢复标签页 → 按需创建
     */
    _syncSidebarView() {
        if (this._isUnloaded) return;
        var leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOOD);

        // 修复：如果出现重复标签页，只保留一个
        if (leaves.length > 1) {
            var keep = this._dedupeLeaves(leaves);
            if (keep && keep.view && keep.view._render) keep.view._render();
            return;
        }

        // 已有且唯一，无需操作
        if (leaves.length === 1) return;

        // 尚无视图：优先复用 workspace.json 恢复出的待注册标签页
        var pending = this._findPendingLeaf();
        if (pending) {
            pending.setViewState({ type: VIEW_TYPE_MOOD, active: false });
            return;
        }

        this.activateView();
    }

    /**
     * 去重：保留右侧边栏中的标签页（或活动标签页），其余 detach
     */
    _dedupeLeaves(leaves) {
        if (!leaves || leaves.length <= 1) return leaves ? leaves[0] : null;
        var activeLeaf = this.app.workspace.activeLeaf;
        var keep = null;
        var self = this;

        // 优先保留右侧边栏中的标签页
        for (var i = 0; i < leaves.length; i++) {
            if (self._isInRightSplit(leaves[i])) { keep = leaves[i]; break; }
        }
        // 其次保留当前活动标签页
        if (!keep && activeLeaf && leaves.indexOf(activeLeaf) !== -1) {
            keep = activeLeaf;
        }
        // 否则保留第一个
        if (!keep) keep = leaves[0];

        for (var j = 0; j < leaves.length; j++) {
            if (leaves[j] !== keep) leaves[j].detach();
        }
        return keep;
    }

    /**
     * 查找尚未实例化但视图状态为 mood-calendar 的待恢复标签页
     * （延迟加载时 workspace.json 恢复出的 pending leaf）
     */
    _findPendingLeaf() {
        var found = null;
        function walk(node) {
            if (found || !node) return;
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) walk(node.children[i]);
                return;
            }
            if (typeof node.getViewState !== 'function') return;
            if (node.view) return; // 已实例化的由 getLeavesOfType 处理
            try {
                var st = node.getViewState();
                if (st && st.type === VIEW_TYPE_MOOD) found = node;
            } catch (e) { /* ignore */ }
        }
        // 优先搜索右侧边栏
        walk(this.app.workspace.rightSplit);
        // 再搜索整个工作区
        if (!found) walk(this.app.workspace.rootSplit);
        return found;
    }

    /**
     * 判断标签页是否在右侧边栏中
     */
    _isInRightSplit(leaf) {
        var rightSplit = this.app.workspace.rightSplit;
        var node = leaf;
        while (node) {
            if (node === rightSplit) return true;
            node = node.parent;
        }
        return false;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        currentLanguage = this.settings.language || 'zh';
        // 旧版 moodOptions 为对象数组，迁移为字符串数组
        if (this.settings.moodOptions.length > 0 && typeof this.settings.moodOptions[0] === 'object') {
            this.settings.moodOptions = this.settings.moodOptions.map(function (m) {
                return m.emoji + ' ' + m.text;
            });
            this.saveSettings();
        }
    }

    applyColorSettings() {
        var root = document.documentElement;
        root.style.setProperty('--mood-calendar-dot-size', this.settings.dotSize + 'px');
        root.style.setProperty('--mood-calendar-active-border', this.settings.activeBorderColor);
        root.style.setProperty('--mood-calendar-active-bg', this.settings.activeBgColor);
        root.style.setProperty('--mood-calendar-today-border', this.settings.todayBorderColor);
        root.style.setProperty('--mood-calendar-today-bg', this.settings.todayBgColor);
        root.style.setProperty('--mood-calendar-dot-hollow', this.settings.dotHollowColor);
        root.style.setProperty('--mood-calendar-dot-filled', this.settings.dotFilledColor);
    }

    createMoodSelectorExtension() {
        var self = this;
        var showTimeout = null;

        // 监听工作区的鼠标悬停事件
        this.registerDomEvent(document, 'mouseover', function (e) {
            var target = e.target;
            
            // 检查是否在阅读模式下，且设置不允许显示弹窗
            var isReadingMode = document.body.classList.contains('markdown-reading-view') ||
                               target.closest('.markdown-reading-view') ||
                               target.closest('.markdown-preview-view');
            
            if (isReadingMode && !self.settings.showPopupInReadingMode) {
                return; // 阅读模式下且设置不允许，直接返回
            }
            
            // 检查多种可能的属性值容器
            var isPropertyValue = false;
            var propertyRow = null;
            
            // 检查是否是属性值（支持多种类名）
            if (target.classList) {
                isPropertyValue = target.classList.contains('metadata-property-value') ||
                                 target.classList.contains('cm-property-value') ||
                                 target.closest('.metadata-property-value') ||
                                 target.closest('.cm-property-value');
            }
            
            if (isPropertyValue) {
                // 尝试多种方式定位属性行
                propertyRow = target.closest('.metadata-property') ||
                             target.closest('.cm-line') ||
                             target.parentElement;
                
                if (propertyRow) {
                    // 尝试多种方式获取属性名
                    var keyEl = propertyRow.querySelector('.metadata-property-key input') ||
                               propertyRow.querySelector('.cm-property-name') ||
                               propertyRow.querySelector('input[type="text"]');
                    
                    if (keyEl) {
                        var fieldName = keyEl.value || keyEl.textContent || '';

                        if (fieldName === self.settings.moodField) {
                            // 清除之前的定时器
                            if (showTimeout) clearTimeout(showTimeout);
                            
                            // 延迟显示弹窗，避免频繁触发
                            showTimeout = setTimeout(function () {
                                self.showMoodSelector(e, target);
                            }, 300);
                        }
                    }
                }
            }
        });

        // 监听鼠标移出事件
        this.registerDomEvent(document, 'mouseout', function (e) {
            var target = e.target;
            var isPropertyValue = false;
            
            if (target.classList) {
                isPropertyValue = target.classList.contains('metadata-property-value') ||
                                 target.classList.contains('cm-property-value') ||
                                 target.closest('.metadata-property-value') ||
                                 target.closest('.cm-property-value');
            }
            
            if (isPropertyValue) {
                // 清除显示定时器
                if (showTimeout) {
                    clearTimeout(showTimeout);
                    showTimeout = null;
                }
                
                // 延迟隐藏弹窗，给用户时间移动到弹窗上
                setTimeout(function () {
                    var popup = document.querySelector('.mood-selector-popup');
                    if (popup && !popup.matches(':hover')) {
                        popup.remove();
                    }
                }, 200);
            }
        });
    }

    showMoodSelector(event, targetElement) {
        // 如果已经存在弹窗，先移除
        var existingPopup = document.querySelector('.mood-selector-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // 使用设置中的心情选项
        var moodOptions = this.settings.moodOptions;

        // 创建弹窗
        var popup = document.createElement('div');
        popup.className = 'mood-selector-popup';
        popup.style.position = 'absolute';
        popup.style.background = 'var(--background-primary)';
        popup.style.border = '1px solid var(--background-modifier-border)';
        popup.style.borderRadius = '6px';
        popup.style.padding = '8px';
        popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.gap = '4px';

        // 设置位置
        var rect = targetElement.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + 4) + 'px';

        // 添加选项
        var self = this;
        moodOptions.forEach(function (option) {
            var item = document.createElement('div');
            item.style.padding = '6px 12px';
            item.style.cursor = 'pointer';
            item.style.borderRadius = '4px';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '8px';
            item.textContent = option;

            item.addEventListener('mouseenter', function () {
                item.style.background = 'var(--background-modifier-hover)';
            });
            item.addEventListener('mouseleave', function () {
                item.style.background = 'transparent';
            });
            item.addEventListener('click', function () {
                var newValue = option;
                
                // 找到属性行
                var propertyRow = targetElement.closest('.metadata-property');
                if (!propertyRow) {
                    popup.remove();
                    return;
                }
                
                // 找到属性值容器（不是属性名容器）
                var valueContainer = propertyRow.querySelector('.metadata-property-value');
                if (!valueContainer) {
                    popup.remove();
                    return;
                }
                
                // 在属性值容器内查找输入框或可编辑元素
                var inputEl = valueContainer.querySelector('input') ||
                             valueContainer.querySelector('[contenteditable="true"]') ||
                             valueContainer.querySelector('.cm-content');

                if (inputEl) {
                    // 设置值
                    if (inputEl.tagName === 'INPUT') {
                        inputEl.value = newValue;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('blur', { bubbles: true }));
                    } else if (inputEl.contentEditable === 'true') {
                        inputEl.textContent = newValue;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('blur', { bubbles: true }));
                    } else if (inputEl.classList.contains('cm-content')) {
                        // CodeMirror 编辑器
                        inputEl.textContent = newValue;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else {
                    // 尝试直接设置文本内容
                    valueContainer.textContent = newValue;
                    valueContainer.dispatchEvent(new Event('input', { bubbles: true }));
                    valueContainer.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                popup.remove();
            });

            popup.appendChild(item);
        });

        // 添加鼠标移出弹窗的监听器
        popup.addEventListener('mouseout', function (e) {
            // 检查鼠标是否真的离开了弹窗（而不是移动到子元素）
            if (!popup.contains(e.relatedTarget)) {
                popup.remove();
            }
        });

        document.body.appendChild(popup);
    }

    async saveSettings() {
        currentLanguage = this.settings.language || 'zh';
        await this.saveData(this.settings);
        this.applyColorSettings();
        this.refreshViews();
    }

    // data.json 被外部修改（同步、git、手动编辑）时重新加载设置，避免下次保存时覆盖外部修改
    // Reload settings when data.json changes outside Obsidian (Sync, git, hand edit),
    // so the next save does not overwrite the external change
    async onExternalSettingsChange() {
        await this.loadSettings();
        this.applyColorSettings();
        this.refreshViews();
    }

    refreshViews(shouldAutoScroll) {
        var leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOOD);
        leaves.forEach(function (leaf) {
            if (leaf.view && leaf.view._render) leaf.view._render(shouldAutoScroll);
        });
    }

    _scheduleRefresh(delay, shouldAutoScroll) {
        var self = this;
        if (this._refreshTimer) clearTimeout(this._refreshTimer);
        this._refreshTimer = setTimeout(function () {
            self._refreshTimer = null;
            self.refreshViews(shouldAutoScroll);
        }, delay || 500);
    }
}

module.exports = MoodCalendarPlugin;
