import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import logo from './guney-logo.jpg';

// --- Composant Chat Fans ---
const ChatFans = ({ currentUser }) => {
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('chatMessages') || '[]'));
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMessage = {
      text: input,
      date: new Date().toLocaleTimeString(),
      user: currentUser || 'Anonyme'
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-fans">
      <h3>💬 Chat entre fans</h3>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <span className="chat-user">{msg.user}</span>
            <span className="chat-date"> ({msg.date}) :</span> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-row">
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Votre message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="menu-button" onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

// --- Composant Connexion Supporters ---
const SupporterAuth = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const supporters = JSON.parse(localStorage.getItem('supporters') || '[]');

    if (isLogin) {
      // Connexion
      const user = supporters.find(s => s.username === username && s.password === password);
      if (user) {
        onLogin(user.username);
        onClose();
      } else {
        setError('Identifiants incorrects');
      }
    } else {
      // Inscription
      if (supporters.some(s => s.username === username)) {
        setError('Ce nom d\'utilisateur est déjà pris');
        return;
      }
      if (username.length < 3) {
        setError('Le nom d\'utilisateur doit faire au moins 3 caractères');
        return;
      }
      if (password.length < 4) {
        setError('Le mot de passe doit faire au moins 4 caractères');
        return;
      }

      const newSupporter = { username, password };
      localStorage.setItem('supporters', JSON.stringify([...supporters, newSupporter]));
      onLogin(username);
      onClose();
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Connexion' : 'Inscription'} Supporters</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-submit">
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>
        
        <div className="auth-switch">
          {isLogin ? 'Pas encore inscrit ? ' : 'Déjà un compte ? '}
          <button 
            type="button" 
            className="auth-switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Menu Principal ---
const MainMenu = ({ navigate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div
      className="main-menu"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        paddingTop: '40px',
      }}
    >
      <h1
        className="title"
        style={{
          background: 'transparent',
          color: 'black',
          display: 'inline-block',
          padding: '18px 38px',
          borderRadius: '16px',
          fontSize: '2.8rem',
          fontWeight: 'bold',
          marginBottom: '38px',
          boxShadow: 'none',
          letterSpacing: '2px'
        }}
      >
        ASC GUNEY-TEEN BI
      </h1>
      <div style={{ marginTop: 140 }}>
        <button
          className="menu-button"
          style={{
            background: 'linear-gradient(90deg, #FFD600 0%, #FFA000 100%)',
            color: '#222',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            margin: '0 18px',
            padding: '16px 38px',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            cursor: 'pointer'
          }}
          onClick={() => {
            const code = window.prompt('Veuillez entrer le code d\'accès :');
            if (code === '1819') {
              navigate('staff');
            } else if (code !== null) {
              window.alert('Code incorrect !');
            }
          }}
        >
          Staff
        </button>
        <button
          className="menu-button"
          style={{
            background: 'linear-gradient(90deg, #FFD600 0%, #FFA000 100%)',
            color: '#222',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            margin: '0 18px',
            padding: '16px 38px',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            cursor: 'pointer'
          }}
          onClick={() => setShowAuthModal(true)}
        >
          Supporters
        </button>
      </div>

      {showAuthModal && (
        <SupporterAuth 
          onLogin={(username) => {
            localStorage.setItem('currentSupporter', username);
            navigate('public');
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

// --- STAFF AREA ---
const MAX_JOUEURS = 23;
const POSTES = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Remplaçant'];
const COMPETITIONS = ['Championnat', 'Coupe du Maire', 'Zone'];

const StaffArea = ({
  navigate,
  joueurs, setJoueurs,
  nouvelles, setNouvelles,
  calendrier, setCalendrier,
  classement, setClassement,
  votes, setVotes,
  historique, setHistorique
}) => {
  // States
  const [selectedActualite, setSelectedActualite] = useState(null);
  const [nom, setNom] = useState('');
  const [poste, setPoste] = useState(POSTES[0]);
  const [editIndex, setEditIndex] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [editPoste, setEditPoste] = useState(POSTES[0]);
  const [editButs, setEditButs] = useState(0);
  const [editPasses, setEditPasses] = useState(0);
  const [nomActualite, setNomActualite] = useState('');
  const [competition, setCompetition] = useState(COMPETITIONS[0]);
  const [phase, setPhase] = useState('groupes');
  const [editClassement, setEditClassement] = useState(false);
  const [classementInputs, setClassementInputs] = useState(classement[competition] || []);
  const [editCalendrier, setEditCalendrier] = useState(false);
  const [newMatch, setNewMatch] = useState({ adversaire: '', date: '', lieu: 'domicile' });
  const [newEquipe, setNewEquipe] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState({ scoreGuney: '', scoreAdversaire: '' });

  useEffect(() => {
    document.title = "Staff";
    return () => { document.title = "ASC GUNEY TEEN BI"; };
  }, []);

  // Initialisation des données si vides
  useEffect(() => {
    if (Object.keys(classement).length === 0) {
      const initialClassement = {};
      COMPETITIONS.forEach(comp => {
        initialClassement[comp] = [
          { equipe: 'ASC Guney', points: 0, goalDiff: 0 },
          { equipe: 'FC Dakar', points: 0, goalDiff: 0 },
          { equipe: 'US Gorée', points: 0, goalDiff: 0 }
        ];
      });
      setClassement(initialClassement);
    }
  }, [classement, setClassement]);

  // Synchronisation du classement avec la compétition sélectionnée
  useEffect(() => {
    if (competition && classement[competition]) {
      setClassementInputs(classement[competition]);
    } else {
      setClassementInputs([]);
    }
  }, [competition, classement]);

  // Gestion des joueurs
  const ajouterJoueur = () => {
    if (nom.trim() === '' || joueurs.length >= MAX_JOUEURS) return;
    setJoueurs([...joueurs, { nom, poste, buts: 0, passes: 0 }]);
    setNom('');
    setPoste(POSTES[0]);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditNom(joueurs[index].nom);
    setEditPoste(joueurs[index].poste);
    setEditButs(joueurs[index].buts);
    setEditPasses(joueurs[index].passes);
  };

  const handleSave = () => {
    const updated = [...joueurs];
    updated[editIndex] = { nom: editNom, poste: editPoste, buts: editButs, passes: editPasses };
    setJoueurs(updated);
    setEditIndex(null);
  };

  // Gestion des actualités
  const ajouterActualite = () => {
    if (nomActualite.trim() === '') return;
    setNouvelles([...nouvelles, nomActualite]);
    setNomActualite('');
  };

  const supprimerActualite = () => {
    if (selectedActualite !== null) {
      const nouvellesMaj = nouvelles.filter((_, i) => i !== selectedActualite);
      setNouvelles(nouvellesMaj);
      setSelectedActualite(null);
    }
  };

  // Gestion du classement
  const handleClassementChange = (i, field, value) => {
    const updated = classementInputs.map((row, idx) =>
      idx === i ? { ...row, [field]: field === 'equipe' ? value : Number(value) } : row
    );
    setClassementInputs(updated);
  };

  const handleClassementSave = () => {
    const updatedClassement = { ...classement, [competition]: classementInputs };
    setClassement(updatedClassement);
    setEditClassement(false);
  };

  const ajouterEquipeClassement = () => {
    if (newEquipe.trim() === '') return;
    setClassementInputs([...classementInputs, { equipe: newEquipe, points: 0, goalDiff: 0 }]);
    setNewEquipe('');
  };

  // Gestion du calendrier
  const handleCalendrierChange = (i, field, value) => {
    const updated = calendrier.map((row, idx) =>
      idx === i ? { ...row, [field]: value } : row
    );
    setCalendrier(updated);
  };

  const handleCalendrierSave = () => setEditCalendrier(false);

  const handleCalendrierAdd = () => {
    if (!newMatch.adversaire || !newMatch.date) return;
    setCalendrier([...calendrier, newMatch]);
    setNewMatch({ adversaire: '', date: '', lieu: 'domicile' });
  };

  // Gestion des matchs passés
  const archiverMatch = () => {
    if (selectedMatch === null || !matchResult.scoreGuney || !matchResult.scoreAdversaire) return;
    
    const match = calendrier[selectedMatch];
    const nouveauMatchArchive = {
      ...match,
      scoreGuney: matchResult.scoreGuney,
      scoreAdversaire: matchResult.scoreAdversaire,
      date: new Date().toISOString().split('T')[0] // Date d'archivage
    };
    
    // Ajouter à l'historique
    setHistorique([...historique, nouveauMatchArchive]);
    
    // Supprimer du calendrier
    const nouveauCalendrier = calendrier.filter((_, i) => i !== selectedMatch);
    setCalendrier(nouveauCalendrier);
    
    // Réinitialiser
    setSelectedMatch(null);
    setMatchResult({ scoreGuney: '', scoreAdversaire: '' });
  };

  const modifierMatchArchive = (index) => {
    const updatedHistorique = [...historique];
    updatedHistorique[index] = {
      ...updatedHistorique[index],
      scoreGuney: matchResult.scoreGuney,
      scoreAdversaire: matchResult.scoreAdversaire
    };
    setHistorique(updatedHistorique);
    setSelectedMatch(null);
    setMatchResult({ scoreGuney: '', scoreAdversaire: '' });
  };

  const supprimerMatchArchive = (index) => {
    setHistorique(historique.filter((_, i) => i !== index));
  };

  return (
    <div className="page staff-area-pro">
      <h2 className="page-title">Espace Staff</h2>
      <div className="staff-content" style={{ display: 'flex', gap: '20px' }}>
        {/* Colonne gauche - 50% */}
        <div className="staff-col-gauche" style={{ width: '50%' }}>
          {/* Section Joueurs */}
          <div className="staff-joueurs">
            <h3>Joueurs ({joueurs.length}/{MAX_JOUEURS})</h3>
            <table className="player-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Poste</th>
                  <th>Buts</th>
                  <th>Passes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {joueurs.map((joueur, index) => (
                  editIndex === index ? (
                    <tr key={index}>
                      <td><input className="input-field" value={editNom} onChange={e => setEditNom(e.target.value)} /></td>
                      <td>
                        <select className="input-field" value={editPoste} onChange={e => setEditPoste(e.target.value)}>
                          {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td><input className="input-field" type="number" value={editButs} onChange={e => setEditButs(Number(e.target.value))} /></td>
                      <td><input className="input-field" type="number" value={editPasses} onChange={e => setEditPasses(Number(e.target.value))} /></td>
                      <td>
                        <button className="menu-button" onClick={handleSave}>Enregistrer</button>
                        <button className="menu-button" onClick={() => setEditIndex(null)}>Annuler</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{joueur.nom}</td>
                      <td>{joueur.poste}</td>
                      <td>{joueur.buts}</td>
                      <td>{joueur.passes}</td>
                      <td>
                        <button className="menu-button modifier" onClick={() => handleEdit(index)}>Modifier</button>
                        <button className="menu-button supprimer" onClick={() => setJoueurs(joueurs.filter((_, i) => i !== index))}>Supprimer</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
            <div className="input-row">
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Nom du joueur"
                className="input-field"
                disabled={joueurs.length >= MAX_JOUEURS}
              />
              <select
                className="input-field"
                value={poste}
                onChange={e => setPoste(e.target.value)}
                disabled={joueurs.length >= MAX_JOUEURS}
              >
                {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                className="menu-button"
                onClick={ajouterJoueur}
                disabled={joueurs.length >= MAX_JOUEURS}
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Section Actualités */}
          <div className="staff-actus section-editable">
            <h3>Actualités</h3>
            <ul>
              {nouvelles.map((news, i) => (
                <li 
                  key={i}
                  style={{
                    backgroundColor: selectedActualite === i ? 'rgba(255, 215, 0, 0.3)' : 'transparent',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                  onClick={() => setSelectedActualite(i)}
                >
                  {news}
                </li>
              ))}
            </ul>
            <div className="input-row">
              <input
                className="input-field"
                value={nomActualite}
                onChange={e => setNomActualite(e.target.value)}
                placeholder="Nouvelle actualité"
              />
              <button className="menu-button" onClick={ajouterActualite}>Ajouter</button>
              <button 
                className="menu-button supprimer" 
                onClick={supprimerActualite}
                disabled={selectedActualite === null}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Colonne droite - 50% */}
        <div className="staff-col-droite" style={{ width: '50%' }}>
          {/* Calendrier */}
          <div className="staff-calendrier">
            <h3>Calendrier</h3>
            <table className="player-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Adversaire</th>
                  <th>Lieu</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {editCalendrier ? (
                  calendrier.map((match, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="input-field"
                          type="date"
                          value={match.date}
                          onChange={e => handleCalendrierChange(i, 'date', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="input-field"
                          value={match.adversaire}
                          onChange={e => handleCalendrierChange(i, 'adversaire', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="input-field"
                          value={match.lieu}
                          onChange={e => handleCalendrierChange(i, 'lieu', e.target.value)}
                        >
                          <option value="domicile">🏠 Domicile</option>
                          <option value="exterieur">🚌 Extérieur</option>
                        </select>
                      </td>
                      <td>
                        <button className="menu-button supprimer" onClick={() => {
                          setCalendrier(calendrier.filter((_, idx) => idx !== i));
                        }}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  calendrier.map((match, i) => (
                    <tr key={i}>
                      <td>{match.date}</td>
                      <td>{match.adversaire}</td>
                      <td>{match.lieu === 'domicile' ? '🏠' : '🚌'}</td>
                      <td>
                        <button 
                          className="menu-button" 
                          onClick={() => {
                            setSelectedMatch(i);
                            setMatchResult({ scoreGuney: '', scoreAdversaire: '' });
                          }}
                        >
                          Archiver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="button-group">
              {editCalendrier ? (
                <button className="menu-button" onClick={handleCalendrierSave}>Enregistrer</button>
              ) : (
                <>
                  <button className="menu-button" onClick={() => setEditCalendrier(true)}>Modifier</button>
                  <button className="menu-button supprimer" onClick={() => setCalendrier([])}>
                    Tout supprimer
                  </button>
                </>
              )}
            </div>
            <div className="input-row">
              <input
                className="input-field"
                type="date"
                value={newMatch.date}
                onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
              />
              <input
                className="input-field"
                value={newMatch.adversaire}
                onChange={e => setNewMatch({ ...newMatch, adversaire: e.target.value })}
                placeholder="Adversaire"
              />
              <select
                className="input-field"
                value={newMatch.lieu}
                onChange={e => setNewMatch({ ...newMatch, lieu: e.target.value })}
              >
                <option value="domicile">🏠 Domicile</option>
                <option value="exterieur">🚌 Extérieur</option>
              </select>
              <button className="menu-button" onClick={handleCalendrierAdd}>Ajouter</button>
            </div>

            {/* Formulaire pour archiver un match */}
            {selectedMatch !== null && (
              <div className="archive-form">
                <h4>Archiver le match contre {calendrier[selectedMatch]?.adversaire}</h4>
                <div className="input-row">
                  <input
                    className="input-field"
                    type="number"
                    value={matchResult.scoreGuney}
                    onChange={e => setMatchResult({...matchResult, scoreGuney: e.target.value})}
                    placeholder="Score Guney"
                  />
                  <input
                    className="input-field"
                    type="number"
                    value={matchResult.scoreAdversaire}
                    onChange={e => setMatchResult({...matchResult, scoreAdversaire: e.target.value})}
                    placeholder="Score adversaire"
                  />
                  <button className="menu-button" onClick={archiverMatch}>
                    Archiver
                  </button>
                  <button className="menu-button supprimer" onClick={() => setSelectedMatch(null)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Historique des matchs */}
          <div className="staff-historique">
            <h3>Historique des matchs</h3>
            <table className="player-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Adversaire</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((match, i) => (
                  <tr key={i}>
                    <td>{match.date}</td>
                    <td>{match.adversaire}</td>
                    <td>
                      {selectedMatch === i ? (
                        <div className="input-row">
                          <input
                            className="input-field small-input"
                            type="number"
                            value={matchResult.scoreGuney}
                            onChange={e => setMatchResult({...matchResult, scoreGuney: e.target.value})}
                          />
                          -
                          <input
                            className="input-field small-input"
                            type="number"
                            value={matchResult.scoreAdversaire}
                            onChange={e => setMatchResult({...matchResult, scoreAdversaire: e.target.value})}
                          />
                        </div>
                      ) : (
                        `${match.scoreGuney} - ${match.scoreAdversaire}`
                      )}
                    </td>
                    <td>
                      {selectedMatch === i ? (
                        <>
                          <button className="menu-button" onClick={() => modifierMatchArchive(i)}>
                            Enregistrer
                          </button>
                          <button className="menu-button supprimer" onClick={() => setSelectedMatch(null)}>
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="menu-button" 
                            onClick={() => {
                              setSelectedMatch(i);
                              setMatchResult({
                                scoreGuney: match.scoreGuney,
                                scoreAdversaire: match.scoreAdversaire
                              });
                            }}
                          >
                            Modifier
                          </button>
                          <button 
                            className="menu-button supprimer" 
                            onClick={() => supprimerMatchArchive(i)}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Classement */}
          <div className="staff-classement">
            <h3>Classement</h3>
            <div className="filter-row">
              <select
                className="input-field"
                value={competition}
                onChange={e => {
                  setCompetition(e.target.value);
                  setEditClassement(false);
                }}
              >
                {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="input-field"
                value={phase}
                onChange={e => setPhase(e.target.value)}
              >
                <option value="groupes">Phase de groupes</option>
                <option value="huitieme">1/8e finale</option>
                <option value="quart">1/4 finale</option>
                <option value="demi">1/2 finale</option>
                <option value="finale">Finale</option>
              </select>
            </div>
            <table className="player-table">
              <thead>
                <tr>
                  <th>Équipe</th>
                  <th>Points</th>
                  <th>Diff.</th>
                </tr>
              </thead>
              <tbody>
                {phase === 'groupes' ? (
                  classementInputs.map((equipe, i) => (
                    editClassement ? (
                      <tr key={i}>
                        <td>
                          <input
                            className="input-field"
                            value={equipe.equipe}
                            onChange={e => handleClassementChange(i, 'equipe', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="input-field"
                            type="number"
                            value={equipe.points}
                            onChange={e => handleClassementChange(i, 'points', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="input-field"
                            type="number"
                            value={equipe.goalDiff}
                            onChange={e => handleClassementChange(i, 'goalDiff', e.target.value)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td>{equipe.equipe}</td>
                        <td>{equipe.points}</td>
                        <td>{equipe.goalDiff}</td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="adversaire-info">
                      {classement[competition]?.[0]?.adversaire
                        ? `Adversaire : ${classement[competition][0].adversaire}`
                        : 'Adversaire à définir'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {editClassement && (
              <div className="input-row" style={{ marginTop: '10px' }}>
                <input
                  className="input-field"
                  value={newEquipe}
                  onChange={e => setNewEquipe(e.target.value)}
                  placeholder="Nouvelle équipe"
                />
                <button className="menu-button" onClick={ajouterEquipeClassement}>
                  Ajouter
                </button>
              </div>
            )}
            <div className="button-group" style={{ marginTop: '10px' }}>
              <button className="menu-button" onClick={() => setEditClassement(!editClassement)}>
                {editClassement ? 'Annuler' : 'Modifier'}
              </button>
              {editClassement && (
                <button className="menu-button" onClick={handleClassementSave}>
                  Enregistrer
                </button>
              )}
              <button className="menu-button supprimer" onClick={() => setClassement({})}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="menu-button back-button" onClick={() => navigate('menu')}>Retour</button>
    </div>
  );
};

// --- PUBLIC AREA ---
const PublicArea = ({
  navigate,
  joueurs,
  nouvelles,
  calendrier,
  classement,
  votes, setVotes,
  historique
}) => {
  const [statType, setStatType] = useState('buts');
  const [voteType, setVoteType] = useState('match');
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const [competition, setCompetition] = useState(COMPETITIONS[0]);
  const [phase, setPhase] = useState('groupes');
  const currentUser = localStorage.getItem('currentSupporter');

  const voter = () => {
    if (!selected || !currentUser) return;
    
    // Vérifier si l'utilisateur a déjà voté pour ce type de vote
    const userVotes = JSON.parse(localStorage.getItem('userVotes') || '{}');
    if (userVotes[currentUser]?.[voteType]) {
      setMessage('Vous avez déjà voté pour ce type de vote !');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    // Mettre à jour les votes globaux
    const key = `${voteType}_${selected}`;
    const nvVotes = { ...votes, [key]: (votes[key] || 0) + 1 };
    setVotes(nvVotes);
    localStorage.setItem('votes', JSON.stringify(nvVotes));
    
    // Enregistrer que l'utilisateur a voté
    const newUserVotes = {
      ...userVotes,
      [currentUser]: {
        ...(userVotes[currentUser] || {}),
        [voteType]: true
      }
    };
    localStorage.setItem('userVotes', JSON.stringify(newUserVotes));
    
    setMessage('Merci pour votre vote !');
    setTimeout(() => setMessage(''), 2000);
    setSelected('');
  };

  const topJoueurs = Object.entries(votes)
    .filter(([k]) => k.startsWith(voteType + '_'))
    .map(([k, v]) => [k.replace(voteType + '_', ''), v])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const handleLogout = () => {
    localStorage.removeItem('currentSupporter');
    navigate('menu');
  };

  return (
    <div className="page supporter-area-pro">
      <h2 className="page-title">Espace Supporters</h2>
      
      {currentUser && (
        <div className="user-info">
          Connecté en tant que : <strong>{currentUser}</strong>
          <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
      
      <div className="supporter-content" style={{ display: 'flex', gap: '20px' }}>
        {/* Colonne gauche - 50% */}
        <div className="supporter-col-gauche" style={{ width: '50%' }}>
          {/* Section Vote */}
          <div className="vote-section">
            <h3>Votez pour le meilleur joueur</h3>
            <div className="vote-controls">
              <select 
                className="input-field" 
                value={voteType} 
                onChange={e => setVoteType(e.target.value)}
              >
                <option value="match">Joueur du match</option>
                <option value="mois">Joueur du mois</option>
              </select>
              <select
                className="input-field"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">Choisir un joueur</option>
                {joueurs.map((j, i) => (
                  <option key={i} value={j.nom}>{j.nom}</option>
                ))}
              </select>
              <button 
                className="menu-button" 
                onClick={voter} 
                disabled={!selected || !currentUser}
              >
                Voter
              </button>
            </div>
            
            {message && <div className="vote-message">{message}</div>}
            
            <div className="vote-results">
              <h4>🏆 Top 3 des votes</h4>
              {topJoueurs.length === 0 ? (
                <div>Aucun vote pour l'instant.</div>
              ) : (
                topJoueurs.map(([nom, nbVotes], i) => (
                  <div key={nom} className="vote-result-item">
                    <strong>{i + 1}. {nom}</strong>
                    <div className="vote-bar-container">
                      <div 
                        className="vote-bar"
                        style={{ width: `${Math.min(100, nbVotes * 100)}%` }}
                      >
                        {nbVotes} vote{nbVotes > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat entre fans */}
          <ChatFans currentUser={currentUser} />
        </div>
        
        {/* Colonne droite - 50% */}
        <div className="supporter-col-droite" style={{ width: '50%' }}>
          {/* Actualités */}
          <div className="news-section">
            <h3>Actualités</h3>
            <ul className="news-list">
              {nouvelles.length === 0 ? (
                <li>Aucune actualité pour le moment</li>
              ) : (
                nouvelles.map((news, i) => (
                  <li key={i} className="news-item">
                    <span className="news-bullet">•</span> {news}
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Statistiques */}
          <div className="stats-section">
            <div className="stats-header">
              <h3>
                {statType === 'buts' ? '🥇 Top 3 Buteurs' : '🥈 Top 3 Passeurs'}
              </h3>
              <select
                className="input-field stats-select"
                value={statType}
                onChange={e => setStatType(e.target.value)}
              >
                <option value="buts">Buteurs</option>
                <option value="passes">Passeurs</option>
              </select>
            </div>
            
            <table className="stats-table bordered-table">
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>{statType === 'buts' ? 'Buts' : 'Passes'}</th>
                </tr>
              </thead>
              <tbody>
                {joueurs
                  .sort((a, b) => b[statType] - a[statType])
                  .slice(0, 3)
                  .map((j, i) => (
                    <tr key={j.nom}>
                      <td>{i + 1}. {j.nom}</td>
                      <td className="stat-value">{j[statType]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Historique des matchs */}
          <div className="history-section">
            <h3>Historique des matchs</h3>
            <table className="history-table bordered-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Adversaire</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {historique.length === 0 ? (
                  <tr>
                    <td colSpan={3}>Aucun match archivé</td>
                  </tr>
                ) : (
                  historique.map((match, i) => (
                    <tr key={i}>
                      <td>{match.date}</td>
                      <td>{match.adversaire}</td>
                      <td>{match.scoreGuney} - {match.scoreAdversaire}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Classement */}
          <div className="ranking-section">
            <h3>Classement</h3>
            <div className="ranking-filters">
              <select
                className="input-field"
                value={competition}
                onChange={e => setCompetition(e.target.value)}
              >
                {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="input-field"
                value={phase}
                onChange={e => setPhase(e.target.value)}
              >
                <option value="groupes">Phase de groupes</option>
                <option value="huitieme">1/8e finale</option>
                <option value="quart">1/4 finale</option>
                <option value="demi">1/2 finale</option>
                <option value="finale">Finale</option>
              </select>
            </div>
            
            <table className="ranking-table bordered-table">
              <thead>
                <tr>
                  <th>Équipe</th>
                  <th>Points</th>
                  <th>Diff.</th>
                </tr>
              </thead>
              <tbody>
                {phase === 'groupes' ? (
                  classement[competition]?.map((equipe, i) => (
                    <tr key={i} className={equipe.equipe === 'ASC Guney' ? 'highlighted-row' : ''}>
                      <td>{equipe.equipe}</td>
                      <td>{equipe.points}</td>
                      <td>{equipe.goalDiff}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="next-opponent">
                      {classement[competition]?.[0]?.adversaire
                        ? `Prochain adversaire : ${classement[competition][0].adversaire}`
                        : 'Adversaire à définir'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Calendrier */}
          <div className="schedule-section">
            <h3>Calendrier</h3>
            <table className="schedule-table bordered-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Adversaire</th>
                  <th>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {calendrier.length === 0 ? (
                  <tr>
                    <td colSpan={3}>Aucun match programmé</td>
                  </tr>
                ) : (
                  calendrier.map((match, i) => (
                    <tr key={i}>
                      <td>{match.date}</td>
                      <td>{match.adversaire}</td>
                      <td className={match.lieu === 'domicile' ? 'home-match' : 'away-match'}>
                        {match.lieu === 'domicile' ? '🏠 Domicile' : '🚌 Extérieur'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <button className="back-button" onClick={() => navigate('menu')}>Retour</button>
    </div>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [page, setPage] = useState('menu');
  
  // Chargement des données depuis le localStorage
  const loadData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // État centralisé
  const [appState, setAppState] = useState(() => ({
    joueurs: loadData('joueurs', []),
    nouvelles: loadData('nouvelles', []),
    calendrier: loadData('calendrier', []),
    classement: loadData('classement', {}),
    votes: loadData('votes', {}),
    historique: loadData('historique', [])
  }));

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem('joueurs', JSON.stringify(appState.joueurs));
    localStorage.setItem('nouvelles', JSON.stringify(appState.nouvelles));
    localStorage.setItem('calendrier', JSON.stringify(appState.calendrier));
    localStorage.setItem('classement', JSON.stringify(appState.classement));
    localStorage.setItem('votes', JSON.stringify(appState.votes));
    localStorage.setItem('historique', JSON.stringify(appState.historique));
  }, [appState]);

  // Fonctions de mise à jour
  const updateJoueurs = (newJoueurs) => {
    setAppState(prev => ({ ...prev, joueurs: newJoueurs }));
  };

  const updateNouvelles = (newNouvelles) => {
    setAppState(prev => ({ ...prev, nouvelles: newNouvelles }));
  };

  const updateCalendrier = (newCalendrier) => {
    setAppState(prev => ({ ...prev, calendrier: newCalendrier }));
  };

  const updateClassement = (newClassement) => {
    setAppState(prev => ({ ...prev, classement: newClassement }));
  };

  const updateVotes = (newVotes) => {
    setAppState(prev => ({ ...prev, votes: newVotes }));
  };

  const updateHistorique = (newHistorique) => {
    setAppState(prev => ({ ...prev, historique: newHistorique }));
  };

  return (
    <div className="app">
      {page === 'menu' && <MainMenu navigate={setPage} />}
      {page === 'staff' && (
        <StaffArea
          navigate={setPage}
          joueurs={appState.joueurs} setJoueurs={updateJoueurs}
          nouvelles={appState.nouvelles} setNouvelles={updateNouvelles}
          calendrier={appState.calendrier} setCalendrier={updateCalendrier}
          classement={appState.classement} setClassement={updateClassement}
          votes={appState.votes} setVotes={updateVotes}
          historique={appState.historique} setHistorique={updateHistorique}
        />
      )}
      {page === 'public' && (
        <PublicArea
          navigate={setPage}
          joueurs={appState.joueurs}
          nouvelles={appState.nouvelles}
          calendrier={appState.calendrier}
          classement={appState.classement}
          votes={appState.votes} setVotes={updateVotes}
          historique={appState.historique}
        />
      )}
    </div>
  );
};

export default App;