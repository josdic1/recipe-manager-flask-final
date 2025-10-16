import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Code, Database } from 'lucide-react';

function FullSchemaGenerator() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [entities, setEntities] = useState([{ name: '', fields: [] }]);
  const [currentEntityIndex, setCurrentEntityIndex] = useState(0);
  const [relationships, setRelationships] = useState([]);
  const [generatedCode, setGeneratedCode] = useState({ models: '', schemas: '' });

  // Helper functions
  const toSnakeCase = (str) => {
    if (!str) return '';
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  };

  const pluralize = (word) => {
    if (!word) return '';
    const lower = word.toLowerCase();
    if (lower.endsWith('y') && !['ay', 'ey', 'iy', 'oy', 'uy'].some(end => lower.endsWith(end))) {
      return word.slice(0, -1) + 'ies';
    }
    if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || 
        lower.endsWith('ch') || lower.endsWith('sh')) {
      return word + 'es';
    }
    return word + 's';
  };

  // Entity management
  const addEntity = () => setEntities([...entities, { name: '', fields: [] }]);
  const removeEntity = (index) => {
    if (entities.length > 1) setEntities(entities.filter((_, i) => i !== index));
  };
  const updateEntityName = (index, name) => {
    const updated = [...entities];
    updated[index].name = name;
    setEntities(updated);
  };

  // Field management
  const addField = (entityIndex) => {
    const updated = [...entities];
    updated[entityIndex].fields.push({ name: '', type: 'String' });
    setEntities(updated);
  };
  const removeField = (entityIndex, fieldIndex) => {
    const updated = [...entities];
    updated[entityIndex].fields = updated[entityIndex].fields.filter((_, i) => i !== fieldIndex);
    setEntities(updated);
  };
  const updateField = (entityIndex, fieldIndex, key, value) => {
    const updated = [...entities];
    updated[entityIndex].fields[fieldIndex][key] = value;
    setEntities(updated);
  };

  // Relationship detection
  const askRelationships = () => {
    const rels = [];
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        if (entities[i].name && entities[j].name) {
          rels.push({
            entity1: entities[i].name,
            entity2: entities[j].name,
            entity1HasMany: null,
            entity2HasMany: null
          });
        }
      }
    }
    setRelationships(rels);
    setStep(3);
  };

  const updateRelationship = (index, key, value) => {
    const updated = [...relationships];
    updated[index][key] = value;
    setRelationships(updated);
  };

  const generateAllCode = () => {
    let modelsCode = `# Generated Models for ${projectName}\n\n`;
    modelsCode += `from extensions import db\n`;
    modelsCode += `from datetime import datetime, timezone\n\n`;

    let schemasCode = `# Generated Schemas for ${projectName}\n\n`;
    schemasCode += `from extensions import ma\n`;
    
    const entityNames = entities.map(e => e.name).filter(Boolean);
    schemasCode += `from models import ${entityNames.join(', ')}\n\n`;
    
    const bridgeTables = [];
    const entityRelationships = {};
    entities.forEach(e => { if (e.name) entityRelationships[e.name] = []; });

    relationships.forEach(rel => {
      const { entity1, entity2, entity1HasMany, entity2HasMany } = rel;
      if (entity1HasMany && entity2HasMany) {
        const bridgeName = `${toSnakeCase(entity1)}_${toSnakeCase(pluralize(entity2))}`;
        bridgeTables.push({ name: bridgeName, entity1, entity2 });
        entityRelationships[entity1].push({ type: 'many-to-many', target: entity2, bridgeTable: bridgeName });
        entityRelationships[entity2].push({ type: 'many-to-many', target: entity1, bridgeTable: bridgeName });
      } else if (entity1HasMany && !entity2HasMany) {
        entityRelationships[entity1].push({ type: 'one-to-many', target: entity2 });
        entityRelationships[entity2].push({ type: 'many-to-one', target: entity1 });
      } else if (!entity1HasMany && entity2HasMany) {
        entityRelationships[entity2].push({ type: 'one-to-many', target: entity1 });
        entityRelationships[entity1].push({ type: 'many-to-one', target: entity2 });
      }
    });

    if (bridgeTables.length > 0) {
      modelsCode += `# Bridge Tables (for Many-to-Many relationships)\n\n`;
      bridgeTables.forEach(bridge => {
        const table1 = toSnakeCase(pluralize(bridge.entity1));
        const table2 = toSnakeCase(pluralize(bridge.entity2));
        modelsCode += `${bridge.name} = db.Table('${bridge.name}',\n`;
        modelsCode += `    db.Column('${toSnakeCase(bridge.entity1)}_id', db.Integer, db.ForeignKey('${table1}.id'), primary_key=True),\n`;
        modelsCode += `    db.Column('${toSnakeCase(bridge.entity2)}_id', db.Integer, db.ForeignKey('${table2}.id'), primary_key=True)\n`;
        modelsCode += `)\n\n`;
      });
    }

    entities.forEach(entity => {
      if (!entity.name) return;
      const rels = entityRelationships[entity.name] || [];
      modelsCode += `class ${entity.name}(db.Model):\n`;
      modelsCode += `    __tablename__ = '${toSnakeCase(pluralize(entity.name))}'\n\n`;
      modelsCode += `    id = db.Column(db.Integer, primary_key=True)\n`;
      entity.fields.forEach(field => {
        if (field.name) {
          const dbType = field.type === 'String' ? 'db.String(255)' : 'db.Integer';
          modelsCode += `    ${toSnakeCase(field.name)} = db.Column(${dbType})\n`;
        }
      });
      rels.filter(r => r.type === 'many-to-one').forEach(rel => {
        modelsCode += `    ${toSnakeCase(rel.target)}_id = db.Column(db.Integer, db.ForeignKey('${toSnakeCase(pluralize(rel.target))}.id'))\n`;
      });
      modelsCode += `    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))\n`;
      modelsCode += `    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))\n\n`;
      if (rels.length > 0) {
        modelsCode += `    # Relationships\n`;
        rels.forEach(rel => {
          if (rel.type === 'one-to-many') {
            const relName = toSnakeCase(pluralize(rel.target));
            const backPop = toSnakeCase(entity.name);
            modelsCode += `    ${relName} = db.relationship('${rel.target}', back_populates='${backPop}', cascade='all, delete-orphan')\n`;
          } else if (rel.type === 'many-to-one') {
            const relName = toSnakeCase(rel.target);
            const backPop = toSnakeCase(pluralize(entity.name));
            modelsCode += `    ${relName} = db.relationship('${rel.target}', back_populates='${backPop}')\n`;
          } else if (rel.type === 'many-to-many') {
            const relName = toSnakeCase(pluralize(rel.target));
            const backPop = toSnakeCase(pluralize(entity.name));
            modelsCode += `    ${relName} = db.relationship('${rel.target}', secondary='${rel.bridgeTable}', back_populates='${backPop}')\n`;
          }
        });
      }
      modelsCode += `\n    def __repr__(self):\n`;
      modelsCode += `        return f'<${entity.name} {self.id}>'\n\n\n`;
    });
// --- ALTERED SECTION START ---
    // Generate Marshmallow schemas
    const schemaClasses = [];
    entities.forEach(entity => {
      if (!entity.name) return;
      const rels = entityRelationships[entity.name] || [];
      let schemaString = '';

      schemaString += `class ${entity.name}Schema(ma.SQLAlchemyAutoSchema):\n`;
      
      // Add nested relationships
      const nestedRels = rels.filter(r => r.type === 'one-to-many' || r.type === 'many-to-many');
      if (nestedRels.length > 0) {
          schemaString += `    # Nested relationships\n`;
          nestedRels.forEach(rel => {
              const relName = toSnakeCase(pluralize(rel.target));
              // For exclude, use the relationship name from the OTHER side pointing back to THIS entity
              const excludeName = rel.type === 'many-to-many' 
                ? toSnakeCase(pluralize(entity.name))  // Many-to-many uses plural
                : toSnakeCase(entity.name);            // One-to-many uses singular
              schemaString += `    ${relName} = ma.Nested('${rel.target}Schema', many=True, exclude=('${excludeName}',))\n`;
          });
          schemaString += `\n`;
      }

      schemaString += `    class Meta:\n`;
      schemaString += `        model = ${entity.name}\n`;
      schemaString += `        load_instance = True\n`;
      schemaString += `        include_fk = True\n\n`;
      
      schemaClasses.push({ name: entity.name, code: schemaString });
    });

    // Output all schema classes (define schemas that don't have dependencies first)
    const outputOrder = [];
    const processed = new Set();
    
    // Simple ordering: entities with no nested relationships first
    schemaClasses
      .filter(sc => !sc.code.includes('ma.Nested'))
      .forEach(sc => {
        outputOrder.push(sc);
        processed.add(sc.name);
      });
    
    // Then entities with nested relationships
    schemaClasses
      .filter(sc => sc.code.includes('ma.Nested'))
      .forEach(sc => {
        if (!processed.has(sc.name)) {
          outputOrder.push(sc);
          processed.add(sc.name);
        }
      });

    // Build the schemas code
    outputOrder.forEach((sc, index) => {
      if (index === 0) {
        schemasCode += `# Schema definitions\n`;
      }
      schemasCode += sc.code;
    });

    // Add schema instantiations
    schemasCode += `# Create ready-to-use instances of your schemas\n`;
    entities.forEach(entity => {
        if (entity.name) {
            schemasCode += `${toSnakeCase(entity.name)}_schema = ${entity.name}Schema()\n`;
            schemasCode += `${toSnakeCase(pluralize(entity.name))}_schema = ${entity.name}Schema(many=True)\n`;
        }
    });
    // --- ALTERED SECTION END ---

    setGeneratedCode({ models: modelsCode, schemas: schemasCode });
    setStep(4);
  };
  
  const reset = () => {
    setStep(1);
    setProjectName('');
    setEntities([{ name: '', fields: [] }]);
    setRelationships([]);
    setGeneratedCode({ models: '', schemas: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
              <Database className="w-10 h-10 text-indigo-600" />
              Complete Schema Generator
            </h1>
            <p className="text-gray-600">Build your database models and Marshmallow schemas</p>
          </div>

          <div className="flex justify-center mb-8">
             <div className="flex items-center gap-2">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
               <ArrowRight className="w-5 h-5 text-gray-400" />
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
               <ArrowRight className="w-5 h-5 text-gray-400" />
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
               <ArrowRight className="w-5 h-5 text-gray-400" />
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>4</div>
             </div>
           </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Define Your Main Tables</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Music Tracker, Event Manager" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Main Tables (Entities)</label>
                <p className="text-sm text-gray-600 mb-2">What are the main "things" in your app? (e.g., Event, Speaker, Track, Link)</p>
                <p className="text-sm text-indigo-600 font-semibold mb-4">💡 You need at least 2 tables to create relationships</p>
                {entities.map((entity, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input type="text" value={entity.name} onChange={(e) => updateEntityName(index, e.target.value)} placeholder="Entity name (e.g., Event, Book)" className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none" />
                    {entities.length > 1 && (<button onClick={() => removeEntity(index)} className="px-4 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>)}
                  </div>
                ))}
                <button onClick={addEntity} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"><Plus className="w-5 h-5" /> Add Another Table</button>
              </div>
              {(!projectName || entities.filter(e => e.name).length < 2) && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 font-semibold">⚠️ Before you continue:</p>
                  <ul className="list-disc list-inside text-yellow-700 mt-2">
                    {!projectName && <li>Enter a project name</li>}
                    {entities.filter(e => e.name).length < 2 && <li>Add at least 2 tables (you have {entities.filter(e => e.name).length})</li>}
                  </ul>
                </div>
              )}
              <button onClick={() => setStep(2)} disabled={!projectName || entities.filter(e => e.name).length < 2} className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">Next: Add Fields →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Add Fields to Each Table</h2>
              <div className="flex gap-2 mb-6">
                {entities.filter(e => e.name).map((entity, index) => (<button key={index} onClick={() => setCurrentEntityIndex(index)} className={`px-4 py-2 rounded-lg font-semibold transition ${currentEntityIndex === index ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{entity.name}</button>))}
              </div>
              {entities[currentEntityIndex] && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Fields for {entities[currentEntityIndex].name}</h3>
                  <p className="text-sm text-gray-600 mb-4">💡 Don't add id, created_at, or updated_at - those are automatic!</p>
                  {entities[currentEntityIndex].fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex gap-2 mb-3">
                      <input type="text" value={field.name} onChange={(e) => updateField(currentEntityIndex, fieldIndex, 'name', e.target.value)} placeholder="Field name (e.g., title, name, bio)" className="flex-1 px-3 py-2 border border-gray-300 rounded" />
                      <select value={field.type} onChange={(e) => updateField(currentEntityIndex, fieldIndex, 'type', e.target.value)} className="px-3 py-2 border border-gray-300 rounded">
                        <option value="String">String</option><option value="Integer">Integer</option>
                      </select>
                      <button onClick={() => removeField(currentEntityIndex, fieldIndex)} className="px-3 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <button onClick={() => addField(currentEntityIndex)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"><Plus className="w-5 h-5" /> Add Field</button>
                </div>
              )}
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100">← Back</button>
                <button onClick={askRelationships} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">Next: Define Relationships →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Define Relationships</h2>
              <p className="text-gray-600 mb-6">Answer these simple questions about how your tables connect:</p>
              {relationships.map((rel, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 border-2 border-indigo-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">{rel.entity1} ↔ {rel.entity2}</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-700 font-semibold mb-3">Can one {rel.entity1} have multiple {pluralize(rel.entity2)}?</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => updateRelationship(index, 'entity1HasMany', false)} className={`py-3 px-6 rounded-lg font-bold border-2 transition ${rel.entity1HasMany === false ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-300 hover:border-gray-400'}`}>❌ No</button>
                        <button onClick={() => updateRelationship(index, 'entity1HasMany', true)} className={`py-3 px-6 rounded-lg font-bold border-2 transition ${rel.entity1HasMany === true ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-300 hover:border-gray-400'}`}>✅ Yes</button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-3">Can one {rel.entity2} have multiple {pluralize(rel.entity1)}?</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => updateRelationship(index, 'entity2HasMany', false)} className={`py-3 px-6 rounded-lg font-bold border-2 transition ${rel.entity2HasMany === false ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-300 hover:border-gray-400'}`}>❌ No</button>
                        <button onClick={() => updateRelationship(index, 'entity2HasMany', true)} className={`py-3 px-6 rounded-lg font-bold border-2 transition ${rel.entity2HasMany === true ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-300 hover:border-gray-400'}`}>✅ Yes</button>
                      </div>
                    </div>
                    {rel.entity1HasMany !== null && rel.entity2HasMany !== null && (
                      <div className="bg-white p-3 rounded border-2 border-indigo-300">
                        <p className="font-semibold text-indigo-700">
                          {rel.entity1HasMany && rel.entity2HasMany && '🔗 Many-to-Many (will create bridge table)'}
                          {rel.entity1HasMany && !rel.entity2HasMany && '➡️ One-to-Many (' + rel.entity1 + ' has many ' + pluralize(rel.entity2) + ')'}
                          {!rel.entity1HasMany && rel.entity2HasMany && '⬅️ One-to-Many (' + rel.entity2 + ' has many ' + pluralize(rel.entity1) + ')'}
                          {!rel.entity1HasMany && !rel.entity2HasMany && '❌ No relationship'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100">← Back</button>
                <button onClick={generateAllCode} disabled={relationships.some(r => r.entity1HasMany === null || r.entity2HasMany === null)} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Generate Complete Schema →</button>
              </div>
            </div>
          )}

          {step === 4 && (
             <div>
               <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Code className="w-8 h-8 text-green-600" />Your Complete Schema is Ready!</h2>
               <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-6 max-h-96 overflow-y-auto">
                 <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-2">
                   <h3 className="text-white font-bold">app/models.py</h3>
                   <button onClick={() => { navigator.clipboard.writeText(generatedCode.models); alert('Models code copied!'); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-xs">📋 Copy Models</button>
                 </div>
                 <pre className="whitespace-pre-wrap leading-relaxed">{generatedCode.models}</pre>
               </div>
               <div className="bg-gray-900 text-blue-400 p-6 rounded-lg font-mono text-sm mb-6 max-h-96 overflow-y-auto">
                 <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-2">
                   <h3 className="text-white font-bold">app/schemas.py</h3>
                   <button onClick={() => { navigator.clipboard.writeText(generatedCode.schemas); alert('Schemas code copied!'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-xs">📋 Copy Schemas</button>
                 </div>
                 <pre className="whitespace-pre-wrap leading-relaxed">{generatedCode.schemas}</pre>
               </div>
               <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                 <h3 className="font-bold text-blue-900 mb-2">📝 Next Steps:</h3>
                 <ol className="list-decimal list-inside space-y-1 text-blue-800">
                   <li>Copy the <strong>models</strong> code into your <code className="bg-blue-200 px-2 py-1 rounded">app/models.py</code> file.</li>
                   <li>Copy the <strong>schemas</strong> code into a new <code className="bg-blue-200 px-2 py-1 rounded">app/schemas.py</code> file.</li>
                   <li>Ensure you have a <code className="bg-blue-200 px-2 py-1 rounded">app/extensions.py</code> with Marshmallow initialized (<code className="bg-blue-200 px-2 py-1 rounded">ma = Marshmallow()</code>).</li>
                   <li>Run migrations: <code className="bg-blue-200 px-2 py-1 rounded">flask db migrate</code></li>
                   <li>Apply migrations: <code className="bg-blue-200 px-2 py-1 rounded">flask db upgrade</code></li>
                 </ol>
               </div>
               <button onClick={reset} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">Create Another Schema</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default FullSchemaGenerator;