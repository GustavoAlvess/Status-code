import dados from "../models/dados.js";
const { bruxos } = dados;



// GET /bruxos - Listar todos os bruxos com filtros
const getAllBruxos = (req, res) => {
  const { nome, casa, nivelMagia, ativo } = req.query;
  let resultado = bruxos;

  // Filtro por nome (busca parcial)
  if (nome) {
    resultado = resultado.filter((bruxo) =>
      bruxo.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  // Filtro por casa de Hogwarts
  if (casa) {
    resultado = resultado.filter(
      (bruxo) => bruxo.casa.toLowerCase() === casa.toLowerCase()
    );
  }

  // Filtro por nível de magia
  if (nivelMagia) {
    resultado = resultado.filter(
      (bruxo) => bruxo.nivelMagia.toLowerCase() === nivelMagia.toLowerCase()
    );
  }

  // Filtro por status ativo
  if (ativo !== undefined) {
    resultado = resultado.filter((bruxo) => bruxo.ativo === (ativo === "true"));
  }

  res.status(200).json({
    total: resultado.length,
    bruxos: resultado,
  });
};

// GET /bruxos/:id - Buscar bruxo específico por ID
const getBruxoById = (req, res) => {
    const { id } = req.params;

    // Validar se ID é um número
    if (isNaN(id)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "ID deve ser um número válido!",
            error: "INVALID_ID"
        });
    }

    // Buscar bruxo pelo ID
    const bruxo = bruxos.find(b => b.id === parseInt(id));

    if (!bruxo) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Bruxo não encontrado nos registros de Hogwarts!",
            error: "WIZARD_NOT_FOUND"
        });
    }

    res.status(200).json({
        success: true,
        bruxo: bruxo
    });
};

const createBruxo = (req, res) => {
    const { nome, casa, anoNascimento,varinha, especialidade, nivelMagia, ativo } = req.body;
const casasHogwarts = ["Grifinória", "Sonserina", "Lufa-lufa",]
    // Validações obrigatórias básicas
    if (!casa) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Casa é obrigatório para um novo bruxo!",
            error: "HOUSE_NULL"
        });
    }
    if (!casasHogwarts.includes(casa)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Esta casa não se encontra em Hogwarts!",
            error: "HOUSE_NOT_INCLUDED"
        });
    }
    if (!nome) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Nome é obrigatório para um novo bruxo!",
            error: "NAME_NULL"
        });
    }
    if (!varinha.length > 3) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Uma varinha precisa ter pelo menos 3 caractéres.",
            error: "INSUFFICIENT_CHARACTERS"
        });
    }
    

    // Gerar novo ID simples
    const novoId = bruxos.length + 1;

    // Criar novo bruxo
    const novoBruxo = {
        id: novoId,
        nome,
        casa,
        anoNascimento: parseInt(anoNascimento),
        especialidade: especialidade || "Em desenvolvimento",
        nivelMagia: nivelMagia || "Iniciante",
        ativo: ativo !== undefined ? ativo : true
    };

    bruxos.push(novoBruxo);

    res.status(201).json({
        success: true,
        message: "Bruxo cadastrado com sucesso em Hogwarts!",
        bruxo: novoBruxo
    });
};


const updateBruxo = (req, res) => {
    const { id } = req.params;
    const { nome, casa, anoNascimento, especialidade, nivelMagia, ativo } = req.body;

    // Validar ID
    if (isNaN(id)) {
        return res.status(400).json({
           status: 400,
            success: false,
            message: "ID deve ser um número válido!",
            error: "INVALID_ID"
        });
    }

    const idParaEditar = parseInt(id);
    
    // Verificar se bruxo existe
    const bruxoExiste = bruxos.find(b => b.id === idParaEditar);
    if (!bruxoExiste) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: `Bruxo com ID ${id} não encontrado para atualização!`,
            error: "WIZARD_NOT_FOUND"   
        });
    }

    // Atualizar bruxo usando map
    const bruxosAtualizados = bruxos.map(bruxo => 
        bruxo.id === idParaEditar 
            ? { 
                ...bruxo, 
                ...(nome && { nome }),
                ...(casa && { casa }),
                ...(anoNascimento && { anoNascimento: parseInt(anoNascimento) }),
                ...(especialidade && { especialidade }),
                ...(nivelMagia && { nivelMagia }),
                ...(ativo !== undefined && { ativo })
              }
            : bruxo
    );

    // Atualizar array global
    bruxos.splice(0, bruxos.length, ...bruxosAtualizados);

    // Buscar bruxo atualizado para retorno
    const bruxoAtualizado = bruxos.find(b => b.id === idParaEditar);

    return res.status(200).json({
        status: 200,
        success: true,
        message: `Dados do bruxo ID ${id} atualizados com sucesso!`,
        bruxo: bruxoAtualizado
    });
};

const deleteBruxo = (req, res) => {
    const { id } = req.params;
    const { admin } = req.query;

    const permissao = admin === "admin123" // senha mais forte do mundo 
    // Validar ID
    if (isNaN(id)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "ID deve ser um número válido!",
            error: "INVALID_ID"
        });
    }
    if (!permissao) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "É necessário permissão para deletar bruxos.`",
            error: "ACCESS_DENIED"
        });
    }


    const idParaApagar = parseInt(id);
    
    // Verificar se bruxo existe antes de remover
    const bruxoParaRemover = bruxos.find(b => b.id === idParaApagar);
    if (!bruxoParaRemover) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: `Bruxo com ID ${id} não encontrado para remoção!`,
            error: "WIZARD_NOT_FOUND" 
        });
    }

    // Remover bruxo usando filter
    const bruxosFiltrados = bruxos.filter(bruxo => bruxo.id !== idParaApagar);
    
    // Atualizar array global
    bruxos.splice(0, bruxos.length, ...bruxosFiltrados);

    res.status(200).json({
        success: true,
        message: `Bruxo ${bruxoParaRemover.nome} (ID: ${id}) foi removido dos registros de Hogwarts.`,
        bruxoRemovido: bruxoParaRemover
    });
};
export { getAllBruxos, getBruxoById, createBruxo, updateBruxo, deleteBruxo} 