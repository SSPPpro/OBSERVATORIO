// Sistema de gestión de capas activas

var capasActivasState = {
    capas: {},
    order: [],
    _idCounter: 0
};

var draggedCapaId = null;

function generateCapaId() {
    return 'capa_' + (++capasActivasState._idCounter);
}

/**
 * Agregar una capa activa al panel
 * @param {Object} config - Configuración de la capa
 * @param {string} config.tipo - Tipo: 'quemas', 'imagen', 'vectorial', etc.
 * @param {string} config.nombre - Nombre de la capa
 * @param {Object} config.datos - Datos adicionales (fecha, cobertura, etc.)
 * @param {Function} config.toggle - Función para mostrar/ocultar la capa
 * @returns {string} ID de la capa
 */
function agregarCapaActiva(config) {
    var capaId = generateCapaId();
    
    capasActivasState.capas[capaId] = {
        id: capaId,
        tipo: config.tipo,
        nombre: config.nombre,
        datos: config.datos || {},
        toggle: config.toggle || function() {},
        visible: true
    };
    capasActivasState.order.push(capaId);
    renderizarCapasActivas();
    return capaId;
}

function findCapaActivaByTipo(tipo) {
    return Object.values(capasActivasState.capas).find(function(capa) {
        return capa.tipo === tipo;
    });
}

function setActiveLayer(config) {
    var previous = findCapaActivaByTipo(config.tipo);
    if (previous) {
        removerCapaActiva(previous.id);
    }
    return agregarCapaActiva(config);
}

/**
 * Remover una capa activa del panel
 * @param {string} capaId - ID de la capa a remover
 */
function removerCapaActiva(capaId) {
    console.log('[REMOVER] Eliminando capa:', capaId, 'Stack:', new Error().stack);
    if (capasActivasState.capas[capaId]) {
        delete capasActivasState.capas[capaId];
        var index = capasActivasState.order.indexOf(capaId);
        if (index > -1) {
            capasActivasState.order.splice(index, 1);
        }
        renderizarCapasActivas();
    }
}

/**
 * Actualizar la visibilidad de una capa
 * @param {string} capaId - ID de la capa
 * @param {boolean} visible - True para mostrar, false para ocultar
 */
function actualizarVisibilidadCapa(capaId, visible) {
    if (capasActivasState.capas[capaId]) {
        capasActivasState.capas[capaId].visible = visible;
        if (typeof capasActivasState.capas[capaId].toggle === 'function') {
            capasActivasState.capas[capaId].toggle(visible);
        } else {
            showLayerByType(capasActivasState.capas[capaId].tipo, visible);
        }
        renderizarCapasActivas();
    }
}

/**
 * Renderizar el panel de capas activas
 */
function renderizarCapasActivas() {
    var listContainer = document.getElementById('capasActivasList');
    var emptyMessage = document.getElementById('capasActivasEmpty');
    
    if (!listContainer) return;
    
    console.log('[RENDER] Renderizando capas activas. Total capas:', capasActivasState.order.length);
    
    // Contar capas
    if (capasActivasState.order.length === 0) {
        listContainer.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    // Renderizar cada capa en el orden actual
    var html = '';
    capasActivasState.order.forEach(function(capaId) {
        var capa = capasActivasState.capas[capaId];
        if (!capa) return;
        var claseVisibilidad = capa.visible ? 'visible' : 'hidden';
        html += '<div class="capa-activa-item ' + claseVisibilidad + '" id="' + capa.id + '" draggable="true" data-id="' + capa.id + '">';
        html += '  <div class="capa-activa-header">';
        html += '    <span class="capa-activa-drag-handle" title="Mover capa">☰</span>';
        html += '    <input type="checkbox" class="capa-activa-checkbox" id="chk_' + capa.id + '" ' + (capa.visible ? 'checked' : '') + ' />';
        html += '    <label for="chk_' + capa.id + '" class="capa-activa-nombre">' + escapeHtml(capa.nombre) + '</label>';
        html += '    <span class="capa-activa-tipo">' + escapeHtml(capa.tipo) + '</span>';
        html += '    <button class="capa-activa-delete" title="Eliminar capa">🗑</button>';
        html += '  </div>';
        html += '</div>';
    });
    
    listContainer.innerHTML = html;
    attachDragHandlers();
}

/**
 * Toggle de visibilidad de una capa
 * @param {string} capaId - ID de la capa
 */
function toggleCapaVisibilidad(capaId) {
    if (capasActivasState.capas[capaId]) {
        var nuevoEstado = !capasActivasState.capas[capaId].visible;
        actualizarVisibilidadCapa(capaId, nuevoEstado);
    }
}

function attachDragHandlers() {
    var listContainer = document.getElementById('capasActivasList');
    if (!listContainer) return;

    var items = listContainer.querySelectorAll('.capa-activa-item');
    items.forEach(function(item) {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', onDragStart);
        item.addEventListener('dragover', onDragOver);
        item.addEventListener('dragleave', onDragLeave);
        item.addEventListener('drop', onDrop);
        item.addEventListener('dragend', onDragEnd);
        
        // Agregar manejador para el checkbox
        var checkbox = item.querySelector('.capa-activa-checkbox');
        if (checkbox) {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var capaId = item.dataset.id;
                console.log('[CHECKBOX] Cambiado capa:', capaId, 'checked:', this.checked);
                if (capaId && capasActivasState.capas[capaId]) {
                    var nuevoEstado = this.checked;
                    capasActivasState.capas[capaId].visible = nuevoEstado;
                    
                    // Usar el callback toggle definido en la capa
                    if (typeof capasActivasState.capas[capaId].toggle === 'function') {
                        try {
                            capasActivasState.capas[capaId].toggle(nuevoEstado);
                        } catch (error) {
                            console.error('[CHECKBOX] Error al ejecutar toggle:', error);
                        }
                    }
                    
                    // Actualizar solo la clase visual sin re-renderizar
                    item.classList.remove('visible', 'hidden');
                    if (nuevoEstado) {
                        item.classList.add('visible');
                    } else {
                        item.classList.add('hidden');
                    }
                    
                    // Log para verificar que no se está removiendo
                    console.log('[CHECKBOX] Estado actualizado. Visible:', capasActivasState.capas[capaId].visible, 'Item aún en DOM:', document.getElementById(capaId) ? 'SÍ' : 'NO');
                }
            });
        }
        
        // Agregar manejador para el botón delete
        var deleteBtn = item.querySelector('.capa-activa-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var capaId = item.dataset.id;
                console.log('[DELETE] Eliminando capa:', capaId);
                if (capaId) {
                    removerCapaActiva(capaId);
                }
            }, true); // Capturar en fase de captura
        }
    });
}

function onDragStart(event) {
    draggedCapaId = this.dataset.id;
    event.dataTransfer.effectAllowed = 'move';
    try {
        event.dataTransfer.setData('text/plain', draggedCapaId);
    } catch (e) {
        // Some browsers may fail; still allow drag.
    }
    this.classList.add('dragging');
}

function onDragOver(event) {
    event.preventDefault();
    if (this.dataset.id !== draggedCapaId) {
        this.classList.add('drag-over');
    }
}

function onDragLeave() {
    this.classList.remove('drag-over');
}

function onDrop(event) {
    event.preventDefault();
    this.classList.remove('drag-over');
    var sourceId = event.dataTransfer.getData('text/plain') || draggedCapaId;
    var targetId = this.dataset.id;
    if (sourceId && targetId && sourceId !== targetId) {
        reorderCapas(sourceId, targetId);
    }
}

function onDragEnd() {
    this.classList.remove('dragging');
    var items = document.querySelectorAll('.capa-activa-item');
    items.forEach(function(item) {
        item.classList.remove('drag-over');
    });
    draggedCapaId = null;
}

function reorderCapas(sourceId, targetId) {
    var order = capasActivasState.order;
    var indexSource = order.indexOf(sourceId);
    var indexTarget = order.indexOf(targetId);
    if (indexSource === -1 || indexTarget === -1 || indexSource === indexTarget) {
        return;
    }

    order.splice(indexSource, 1);
    var insertIndex = indexTarget;
    if (indexSource < indexTarget) {
        insertIndex = indexTarget - 1;
    }
    if (insertIndex < 0) insertIndex = 0;
    order.splice(insertIndex, 0, sourceId);
    renderizarCapasActivas();
}

function showLayerByType(tipo, visible) {
    if (tipo === 'imagen') {
        if (typeof toggleImageLayerVisibility === 'function') {
            toggleImageLayerVisibility(visible);
        }
    } else if (tipo === 'quemas') {
        if (typeof toggleBurnLayerVisibility === 'function') {
            toggleBurnLayerVisibility(visible);
        }
    }
}

function toggleImageLayerVisibility(visible) {
    if (typeof shImageOverlay !== 'undefined' && shImageOverlay) {
        shImageOverlay.style.display = visible ? 'block' : 'none';
    }
}

function toggleBurnLayerVisibility(visible) {
    if (typeof currentSHLayer !== 'undefined' && currentSHLayer) {
        try {
            currentSHLayer.setVisibility(visible);
        } catch (e) {
            console.warn('[CAPAS] No se pudo cambiar visibilidad de la capa de quemas:', e);
        }
    }
}

/**
 * Toggle para mostrar/ocultar el panel de capas activas
 */
function toggleCapasActivas() {
    var panel = document.getElementById('panelCapasActivas');
    if (panel) {
        panel.classList.toggle('show');
    }
}

/**
 * Limpiar todas las capas activas
 */
function limpiarCapasActivas() {
    capasActivasState.capas = {};
    capasActivasState.order = [];
    capasActivasState._idCounter = 0;
    renderizarCapasActivas();
}

/**
 * Función auxiliar para escapar HTML
 */
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
