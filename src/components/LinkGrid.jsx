import { useState, useEffect } from 'react';
import {
    Mail, MessageSquare, Music, Video, ShoppingBag,
    Terminal, Globe, Book, Github, Link as LinkIcon,
    Plus, Trash2, Edit2, X, Settings, Star, Cloud,
    Code, Coffee, Twitter, Instagram, Youtube, Twitch,
    Facebook, Linkedin, Server, Feather, Network, Database,
    Cpu, HardDrive
} from 'lucide-react';

const LinkGrid = () => {
    // Available icons for selection
    const AVATAR_ICONS = {
        'Mail': Mail,
        'MessageSquare': MessageSquare,
        'Music': Music,
        'Video': Video,
        'ShoppingBag': ShoppingBag,
        'Terminal': Terminal,
        'Globe': Globe,
        'Book': Book,
        'Github': Github,
        'Star': Star,
        'Cloud': Cloud,
        'Code': Code,
        'Coffee': Coffee,
        // Socials
        'Twitter': Twitter,
        'Instagram': Instagram,
        'Youtube': Youtube,
        'Twitch': Twitch,
        'Facebook': Facebook,
        'Linkedin': Linkedin,
        // New Additions
        'Server': Server,
        'Feather': Feather,
        'Hub': Network,
        'Database': Database,
        'Cpu': Cpu,
        'Drive': HardDrive,
        'LinkIcon': LinkIcon
    };

    // Default links config
    const DEFAULT_LINKS = [
        { name: 'mail', url: 'https://gmail.com', icon: 'Mail' },
        { name: 'chat', url: 'https://chatgpt.com', icon: 'MessageSquare' },
        { name: 'music', url: 'https://spotify.com', icon: 'Music' },
        { name: 'youtube', url: 'https://youtube.com', icon: 'Video' },
        { name: 'shop', url: 'https://amazon.com', icon: 'ShoppingBag' },
        { name: 'dev', url: 'https://github.com', icon: 'Github' },
        { name: 'news', url: 'https://news.ycombinator.com', icon: 'Terminal' },
        { name: 'wiki', url: 'https://wikipedia.org', icon: 'Book' },
        { name: 'maps', url: 'https://maps.google.com', icon: 'Globe' }
    ];

    const [links, setLinks] = useState(() => {
        try {
            const saved = localStorage.getItem('homepage_links');
            return saved ? JSON.parse(saved) : DEFAULT_LINKS;
        } catch (e) {
            console.error('Failed to parse links', e);
            return DEFAULT_LINKS;
        }
    });

    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newLink, setNewLink] = useState({ name: '', url: '', icon: 'LinkIcon' });
    const [showIconPicker, setShowIconPicker] = useState(false);

    useEffect(() => {
        localStorage.setItem('homepage_links', JSON.stringify(links));
    }, [links]);

    const getIcon = (iconName) => {
        const IconComponent = AVATAR_ICONS[iconName] || LinkIcon;
        return <IconComponent size={16} />;
    };

    const handleSave = () => {
        if (newLink.name && newLink.url) {
            if (editingIndex !== null) {
                // Update existing link
                const updatedLinks = [...links];
                updatedLinks[editingIndex] = { ...newLink };
                setLinks(updatedLinks);
                setEditingIndex(null);
            } else {
                // Add new link
                setLinks([...links, { ...newLink }]);
            }
            setNewLink({ name: '', url: '', icon: 'LinkIcon' });
            setShowIconPicker(false);
        }
    };

    const startEditingLink = (index) => {
        setEditingIndex(index);
        setNewLink({ ...links[index] });
        setShowIconPicker(false); // Close picker if open to avoid confusion
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setNewLink({ name: '', url: '', icon: 'LinkIcon' });
        setShowIconPicker(false);
    };

    const removeLink = (index) => {
        if (editingIndex === index) {
            cancelEdit();
        } else if (editingIndex !== null && index < editingIndex) {
            // Adjust index if we removed an item before the one being edited
            setEditingIndex(editingIndex - 1);
        }
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
    };

    const [draggedIndex, setDraggedIndex] = useState(null);
    // ... drag handlers kept same or moved ...

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
        setDraggedIndex(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newLinks = [...links];
        const draggedItem = newLinks[draggedIndex];
        newLinks.splice(draggedIndex, 1);
        newLinks.splice(dropIndex, 0, draggedItem);

        setLinks(newLinks);

        // If we moved the item being edited, update the index
        if (draggedIndex === editingIndex) {
            setEditingIndex(dropIndex);
        } else if (dropIndex <= editingIndex && draggedIndex > editingIndex) {
            setEditingIndex(editingIndex + 1);
        } else if (dropIndex >= editingIndex && draggedIndex < editingIndex) {
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
            }}>
                <div className="text-secondary text-xs" style={{ letterSpacing: '0.1em' }}>
                    links
                </div>
                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        if (isEditing) cancelEdit(); // Clear edit state when exiting edit mode
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isEditing ? 'var(--accent-color)' : 'var(--text-secondary)',
                        padding: '4px'
                    }}
                    title="Edit Links"
                >
                    <Settings size={14} />
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '1.5rem',
                width: '100%',
            }}>
                {links.map((link, index) => (
                    <div
                        key={`${link.name}-${index}`}
                        style={{ position: 'relative', cursor: isEditing ? 'grab' : 'default' }}
                        draggable={isEditing}
                        onDragStart={(e) => isEditing && handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => isEditing && handleDrop(e, index)}
                    >
                        <a
                            href={link.url}
                            onClick={(e) => {
                                if (isEditing) {
                                    e.preventDefault();
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontSize: '0.8rem',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                backgroundColor: editingIndex === index ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: editingIndex === index ? '1px solid var(--accent-color)' : '1px solid transparent',
                                opacity: isEditing ? 0.8 : 1,
                                width: '100%',
                                pointerEvents: isEditing ? 'none' : 'auto',
                                animation: isEditing ? 'jiggle 0.2s infinite' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isEditing) {
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isEditing) {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }
                            }}
                        >
                            {getIcon(link.icon)}
                            <span style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%'
                            }}>
                                {link.name}
                            </span>
                        </a>
                        {isEditing && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        startEditingLink(index);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: '-5px',
                                        background: 'var(--text-primary)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                    title="Edit"
                                >
                                    <Edit2 size={10} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeLink(index);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-5px',
                                        background: 'var(--accent-color)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                    title="Delete"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setShowIconPicker(!showIconPicker)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                width: '100px',
                                justifyContent: 'center'
                            }}
                        >
                            {getIcon(newLink.icon)}
                            <span>{showIconPicker ? 'Close' : 'Icon'}</span>
                        </button>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newLink.name}
                            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                width: '100px',
                                fontFamily: 'inherit'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="URL (https://...)"
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                flex: 1,
                                fontFamily: 'inherit'
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        {editingIndex !== null && (
                            <button
                                onClick={cancelEdit}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    padding: '0 0.75rem',
                                    cursor: 'pointer'
                                }}
                                title="Cancel Edit"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            style={{
                                background: 'var(--accent-color)',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0 0.75rem',
                                cursor: 'pointer'
                            }}
                            title={editingIndex !== null ? "Update Link" : "Add Link"}
                        >
                            {editingIndex !== null ? <Edit2 size={16} /> : <Plus size={16} />}
                        </button>
                    </div>

                    {showIconPicker && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            background: 'black',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            marginTop: '0.5rem',
                            maxHeight: '150px',
                            overflowY: 'auto'
                        }}>
                            {Object.keys(AVATAR_ICONS).map((iconKey) => (
                                <button
                                    key={iconKey}
                                    onClick={() => {
                                        setNewLink({ ...newLink, icon: iconKey });
                                        setShowIconPicker(false);
                                    }}
                                    style={{
                                        background: newLink.icon === iconKey ? 'var(--accent-color)' : 'transparent',
                                        color: newLink.icon === iconKey ? 'black' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title={iconKey}
                                >
                                    {getIcon(iconKey)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LinkGrid;
